#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { build } from './builder.js';
import { startDevServer } from './dev-server.js';
import { AIAssistant } from './ai/assistant.js';
import { createProject } from './create-project.js';
import { MovestaxController } from './core/movestax.js';

program
  .name('cumulus')
  .description('CumulusFlow - AI-Enhanced Serverless Framework')
  .version('0.1.0-beta.1');

program
  .command('install')
  .description('Create a new CumulusFlow project')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        default: 'my-cumulus-app'
      },
      {
        type: 'confirm',
        name: 'useAuth0',
        message: 'Would you like to set up Auth0 integration?',
        default: false
      },
      {
        type: 'confirm',
        name: 'useAI',
        message: 'Enable AI-powered development assistance?',
        default: true
      }
    ]);

    const spinner = ora('Creating your CumulusFlow project...').start();
    
    try {
      await createProject(answers);
      spinner.succeed(chalk.green('Project created successfully! 🚀'));
      console.log('\nTo get started:');
      console.log(chalk.cyan(`\n  cd ${answers.projectName}`));
      console.log(chalk.cyan('  cumulus dev\n'));
    } catch (error) {
      spinner.fail(chalk.red('Failed to create project'));
      console.error(error);
    }
  });

program
  .command('dev')
  .description('Start development server')
  .action(() => {
    console.log(chalk.blue('Starting CumulusFlow development server...'));
    startDevServer();
  });

program
  .command('deploy')
  .description('Deploy to Movestax')
  .action(async () => {
    const spinner = ora('Deploying to Movestax...').start();
    try {
      const controller = new MovestaxController();
      await controller.deploy();
      spinner.succeed(chalk.green('Deployment successful!'));
    } catch (error) {
      spinner.fail(chalk.red('Deployment failed'));
      console.error(error);
    }
  });

program
  .command('analyze')
  .description('Analyze code with AI assistant')
  .action(async () => {
    const spinner = ora('Analyzing project...').start();
    try {
      const ai = new AIAssistant();
      const suggestions = await ai.analyzeProject();
      spinner.stop();
      console.log('\nAI Analysis Results:');
      console.log(suggestions);
    } catch (error) {
      spinner.fail(chalk.red('Analysis failed'));
      console.error(error);
    }
  });

program.parse();
#!/usr/bin/env node
import { program } from 'commander';
import { dev, build, deploy, analyze } from './commands';

program
  .name('cumulus')
  .description('CumulusFlow - AI-Enhanced Serverless Framework')
  .version('0.1.0-beta.1');

program
  .command('dev')
  .description('Start development server')
  .action(dev);

program
  .command('build')
  .description('Build for production')
  .action(build);

program
  .command('deploy')
  .description('Deploy to Movestax')
  .action(deploy);

program
  .command('analyze')
  .description('Analyze code with AI')
  .action(analyze);

program.parse();
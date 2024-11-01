#!/usr/bin/env node
import inquirer from 'inquirer';
import { createProject } from './create-project';
import { validateName } from './utils';

async function init() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      validate: validateName
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Use TypeScript?',
      default: true
    },
    {
      type: 'confirm',
      name: 'auth',
      message: 'Add authentication?',
      default: false
    }
  ]);

  await createProject(answers);
}
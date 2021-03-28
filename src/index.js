import chalk from 'chalk';
import app from './app';

process.on('uncaughtException', err => {
  console.error(chalk.red('UNCAUGHT EXCEPTION! Shutting down...'));
  console.error(chalk.bgRed(err.name), chalk.red(err.message));
  console.error(err);
  process.exit(1);
});

app();

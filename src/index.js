import chalk from 'chalk';
import { PORT } from '@secrets';
import server from '@/server';

process.on('uncaughtException', err => {
  console.error(chalk.red('UNCAUGHT EXCEPTION! Shutting down...'));
  console.error(chalk.bgRed(err.name), chalk.red(err.message));
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`app is runniing on port ${PORT}`);
});

import 'reflect-metadata';
import express from 'express';
import config from '@/config';
import loaders from '@/loaders';

const startServer = () => {
  const app = express();
  loaders({ expressApp: app });

  app.listen(config.port, () => {
    console.info(`app is runniing on port ${config.port}`);
  });
};

export default startServer;

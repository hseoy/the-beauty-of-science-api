import express from 'express';
import auth from './routes/auth';

export default () => {
  const app = express.Router();
  auth(app);
  return app;
};

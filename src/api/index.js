import express from 'express';
import auth from './routes/auth';
import user from './routes/user';

export default () => {
  const app = express.Router();
  auth(app);
  user(app);
  return app;
};

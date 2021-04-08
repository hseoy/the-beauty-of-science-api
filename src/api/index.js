import express from 'express';
import auth from './routes/auth';
import user from './routes/user';
import post from './routes/post';

export default () => {
  const app = express.Router();
  auth(app);
  user(app);
  post(app);
  return app;
};

import express from 'express';
import middlewares from '@/api/middlewares';
import controller from './auth.controller';

const route = express.Router();

export default app => {
  app.use('/auth', route);

  route.post('/signup', controller.handleSignUp);

  route.post('/signin', controller.handleSignIn);

  route.get(
    '/signout',
    middlewares.isAuth,
    middlewares.isAccessToken,
    controller.handleSignOut,
  );

  route.get(
    '/refresh',
    middlewares.isAuth,
    middlewares.isAccessToken,
    controller.handleRefresh,
  );
};

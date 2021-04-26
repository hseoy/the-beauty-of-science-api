import express from 'express';
import middlewares from '@/api/middlewares';
import { celebrate, Joi } from 'celebrate';
import controller from './auth.controller';

const route = express.Router();

export default app => {
  app.use('/auth', route);

  route.post(
    '/signup',
    celebrate({
      body: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      }),
    }),
    controller.handleSignUp,
  );

  route.post(
    '/signin',
    celebrate({
      body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      }),
    }),
    controller.handleSignIn,
  );

  route.get(
    '/signout',
    middlewares.isAuth,
    middlewares.isAccessToken,
    controller.handleSignOut,
  );

  route.get('/refresh', controller.handleRefresh);
};

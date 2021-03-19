import express from 'express';
import { Container } from 'typedi';
import middlewares from '@/api/middlewares';
import AuthService from '@/services/auth';

const route = express.Router();

export default app => {
  app.use('/auth', route);

  route.post('/signup', async (req, res, next) => {
    try {
      const authServiceInstance = Container.get(AuthService);
      const { user, token } = await authServiceInstance.Signup(req.body);
      return res.status(201).json({ success: true, user, token });
    } catch (e) {
      console.log('error: %o', e);
      return next(e);
    }
  });

  route.post('/signin', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const authServiceInstance = Container.get(AuthService);
      const { user, token } = await authServiceInstance.SignIn(email, password);
      return res.json({ success: true, user, token }).status(200);
    } catch (e) {
      console.log('error: %o', e);
      return next(e);
    }
  });

  route.post('/logout', middlewares.isAuth, (req, res, next) => {
    try {
      return res.status(200).end();
    } catch (e) {
      console.error('🔥 error %o', e);
      return next(e);
    }
  });
};

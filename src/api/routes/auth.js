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
      return res.status(201).json({ user, token });
    } catch (e) {
      return next(e);
    }
  });

  route.post('/signin', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const authServiceInstance = Container.get(AuthService);
      const { user, token } = await authServiceInstance.SignIn(email, password);
      return res.status(200).json({ user, token });
    } catch (e) {
      return next(e);
    }
  });

  route.get(
    '/signout',
    middlewares.isAuth,
    middlewares.isAccessToken,
    async (req, res, next) => {
      try {
        const authServiceInstance = Container.get(AuthService);
        const token = req.headers.authorization.split(' ')[1];
        await authServiceInstance.SignOut(token);
        return res.status(200).end();
      } catch (e) {
        return next(e);
      }
    },
  );

  route.post(
    '/refresh',
    middlewares.isAuth,
    middlewares.isRefreshToken,
    async (req, res, next) => {
      const authServiceInstance = Container.get(AuthService);

      try {
        const { access } = req.body;
        const refresh = req.headers.authorization.split(' ')[1];
        const token = await authServiceInstance.RefreshAccessToken(
          refresh,
          access,
        );

        return res.status(200).json(token);
      } catch (e) {
        return next(e);
      }
    },
  );
};

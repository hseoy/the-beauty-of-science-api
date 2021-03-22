import express from 'express';
import middlewares from '../middlewares';

const route = express.Router();

export default app => {
  app.use('/users', route);

  route.get(
    '/me',
    middlewares.isAuth,
    middlewares.isAccessToken,
    middlewares.attachCurrentUser,
    (req, res) => {
      return res.status(200).json({ user: req.currentUser });
    },
  );
};

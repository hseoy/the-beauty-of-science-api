import express from 'express';
import middlewares from '@/api/middlewares';
import controller from './user.controller';

const route = express.Router();

export default app => {
  app.use('/users', route);

  route.get('/', controller.handleGetUserIds);

  route.get('/:id', controller.handleGetUser);
  route.get('/:id/avatar', controller.handleGetUserAvatar);

  route.get(
    '/me',
    middlewares.isAuth,
    middlewares.isAccessToken,
    middlewares.attachCurrentUser,
    controller.handleGetCurrentUser,
  );

  route.put(
    '/me',
    middlewares.isAuth,
    middlewares.isAccessToken,
    middlewares.attachCurrentUser,
    controller.handleUpdateCurrentUser,
  );

  route.delete(
    '/me',
    middlewares.isAuth,
    middlewares.isAccessToken,
    middlewares.attachCurrentUser,
    controller.handleDeleteCurrentUser,
  );

  route.get(
    '/me/avatar',
    middlewares.isAuth,
    middlewares.isAccessToken,
    middlewares.attachCurrentUser,
    controller.handleGetCurrentUserAvatar,
  );

  route.post(
    '/me/avatar',
    middlewares.isAuth,
    middlewares.isAccessToken,
    middlewares.attachCurrentUser,
    middlewares.uploadFile.single('avatar'),
    controller.handleUpdateAvatar,
  );

  route.put(
    '/me/avatar',
    middlewares.isAuth,
    middlewares.isAccessToken,
    middlewares.attachCurrentUser,
    middlewares.uploadFile.single('avatar'),
    controller.handleUpdateAvatar,
  );

  route.delete(
    '/me/avatar',
    middlewares.isAuth,
    middlewares.isAccessToken,
    middlewares.attachCurrentUser,
    controller.handleDeleteAvatar,
  );
};

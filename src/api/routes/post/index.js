import express from 'express';
import middlewares from '@/api/middlewares';
import controller from './post.controller';

const route = express.Router();

export default app => {
  app.use('/posts', route);

  route.get('/', controller.handleGetPostIds);
  route.post(
    '/',
    middlewares.isAuth,
    middlewares.isAccessToken,
    middlewares.attachCurrentUser,
    controller.handleCreatePost,
  );
  route.get('/:id', controller.handleGetPost);
  route.put(
    '/:id',
    middlewares.isAuth,
    middlewares.isAccessToken,
    middlewares.attachCurrentUser,
    controller.handleUpdatePost,
  );
  route.delete(
    '/:id',
    middlewares.isAuth,
    middlewares.isAccessToken,
    middlewares.attachCurrentUser,
    controller.handleDeletePost,
  );

  route.get('/:id/comments', controller.handleGetPostCommentOrIds);
  route.post(
    '/:id/comments',
    middlewares.isAuth,
    middlewares.isAccessToken,
    middlewares.attachCurrentUser,
    controller.handleCreatePostComment,
  );
  route.put(
    '/:id/comments',
    middlewares.isAuth,
    middlewares.isAccessToken,
    middlewares.attachCurrentUser,
    controller.handleUpdatePostComment,
  );
  route.delete(
    '/:id/comments',
    middlewares.isAuth,
    middlewares.isAccessToken,
    middlewares.attachCurrentUser,
    controller.handleDeletePostComment,
  );

  route.get(
    '/:id/score',
    middlewares.isAuth,
    middlewares.isAccessToken,
    middlewares.attachCurrentUser,
    controller.handleGetPostScore,
  );
  route.post(
    '/:id/score',
    middlewares.isAuth,
    middlewares.isAccessToken,
    middlewares.attachCurrentUser,
    controller.handleCreatePostScore,
  );
  route.put(
    '/:id/score',
    middlewares.isAuth,
    middlewares.isAccessToken,
    middlewares.attachCurrentUser,
    controller.handleUpdatePostScore,
  );
  route.delete(
    '/:id/score',
    middlewares.isAuth,
    middlewares.isAccessToken,
    middlewares.attachCurrentUser,
    controller.handleDeletePostScore,
  );
};

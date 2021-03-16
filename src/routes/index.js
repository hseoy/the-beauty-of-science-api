import express from 'express';
import signup from '@/controllers/signup';
import signin from '@/controllers/signin';

const routes = (db, bcrypt, redisClient) => {
  const router = express.Router();

  router.get('/', (_req, res) => {
    res.json('the-beauty-of-science api');
  });

  router.post('/signup', signup(db, bcrypt));
  router.post('/signin', signin(db, bcrypt, redisClient));

  return router;
};

export default routes;

import express from 'express';

const routes = _db => {
  const router = express.Router();

  router.get('/', (_req, res) => {
    res.json('the-beauty-of-science api');
  });

  return router;
};

export default routes;

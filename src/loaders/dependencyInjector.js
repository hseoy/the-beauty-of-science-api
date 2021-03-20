import { Container } from 'typedi';

export default {
  prepare: ({ db, redisClient, bcrypt }) => {
    try {
      Container.set('db', db);
      Container.set('redisClient', redisClient);
      Container.set('bcrypt', bcrypt);
    } catch (e) {
      console.log('Error on dependency injector loader: %o', e);
      throw e;
    }
  },
  helpers: helpers => {
    try {
      helpers.forEach(h => {
        Container.set(h.name, h.helper);
      });
    } catch (e) {
      console.log('Error on dependency injector loader: %o', e);
      throw e;
    }
  },
  models: models => {
    try {
      models.forEach(m => {
        Container.set(m.name, m.model);
      });
    } catch (e) {
      console.log('Error on dependency injector loader: %o', e);
      throw e;
    }
  },
};

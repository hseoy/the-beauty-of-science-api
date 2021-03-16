import knex from 'knex';
import redis from 'redis';

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'user01',
    password: 'user01',
    database: 'the_beauty_of_science',
  },
});

const redisClient = redis.createClient({ host: '127.0.0.1', port: 6379 });

export { redisClient, db };

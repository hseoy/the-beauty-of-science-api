import knex from 'knex';
import config from '@/config';

export default () => {
  return knex({
    client: 'pg',
    connection: {
      host: config.database.postgres.host,
      user: config.database.postgres.user,
      password: config.database.postgres.password,
      database: config.database.postgres.name,
    },
  });
};

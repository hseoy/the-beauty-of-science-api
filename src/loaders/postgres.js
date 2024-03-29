import knex from 'knex';
import config from '@/config';

export default () => {
  let connection;

  if (process.env.NODE_ENV === 'production') {
    connection = {
      connectionString: config.database.connectionUrl,
      ssl: { rejectUnauthorized: false },
    };
  } else if (process.env.NODE_ENV === 'development') {
    connection = {
      host: config.database.postgres.host,
      user: config.database.postgres.user,
      password: config.database.postgres.password,
      database: config.database.postgres.name,
    };
  } else {
    throw new Error(`Unknown NODE_ENV(${process.env.NODE_ENV}`);
  }

  return knex({ client: 'pg', connection });
};

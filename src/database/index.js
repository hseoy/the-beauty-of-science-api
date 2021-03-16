import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'user01',
    password: 'user01',
    database: 'the_beauty_of_science',
  },
});

export default db;

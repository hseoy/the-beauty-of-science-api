import express from 'express';
import knex from 'knex';
import morgan from 'morgan';
import routes from './routes';

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'user01',
    password: 'user01',
    database: 'the_beauty_of_science',
  },
});

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use('/', routes(db));

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`app is runniing on port ${PORT}`);
});

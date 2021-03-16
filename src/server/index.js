import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { db, redisClient } from '@/database';
import { errorHandler, notFoundHandler } from '@/middleware/error';
import { parseAuth } from '@/middleware/auth';
import routes from '@/routes';

const server = express();

server.use(
  morgan('combined', {
    skip(_req, res) {
      return res.statusCode < 400;
    },
  }),
);

server.use(express.json());
server.use(cors());
server.use(parseAuth);
server.use('/', routes(db, bcrypt, redisClient));
server.all('*', notFoundHandler);
server.use(errorHandler);

export default server;

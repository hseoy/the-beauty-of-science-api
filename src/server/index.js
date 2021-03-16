import express from 'express';
import morgan from 'morgan';
import db from '@/database';
import errorHandler from '@/middleware/error';
import ErrorResponse from '@/utils/errorResponse';
import routes from '@/routes';

const server = express();

server.use(express.json());
server.use(
  morgan('combined', {
    skip(_req, res) {
      return res.statusCode < 400;
    },
  }),
);
server.use('/', routes(db));
server.all('*', (req, _res, next) => {
  next(new ErrorResponse(`Can't find ${req.originalURL} on this server!`, 404));
});
server.use(errorHandler);

export default server;

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import createError from 'http-errors';
import routes from '@/api';
import config from '@/config';

export default ({ app }) => {
  app.use(
    morgan('combined', {
      skip(_req, res) {
        return res.statusCode < 400;
      },
    }),
  );
  app.use(cors());
  app.use(express.json());
  app.use(config.api.prefix, routes());

  // Not found handler
  app.use((_req, _res, next) => {
    next(createError(404, 'Not Found'));
  });

  // Error handlers
  app.use((err, _req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .json({ success: false, message: err.message });
    }
    return next(err);
  });
  app.use((err, _req, res, _next) => {
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message });
  });
};

import chalk from 'chalk';
import ErrorResponse from '@/utils/errorResponse';

const sendErrorDevelopment = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    isOperational: err.isOperational,
    stack: err.stacks || err.stack,
  });
};

const sendErrorProduction = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }
  console.error(chalk.bgRed('ERROR!!!'), chalk.red(err));
  res.status(500).json({
    success: false,
    message: 'Something went very wrong',
  });
};

export const errorHandler = (err, _req, res, _next) => {
  const error = { ...err };
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';
  error.message = err.message || 'Server Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDevelopment(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProduction(error, res);
  }
};

export const notFoundHandler = (req, _res, next) => {
  next(new ErrorResponse(`Can't find ${req.originalURL} on this server!`, 404));
};

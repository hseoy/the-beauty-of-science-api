import jwt from 'jsonwebtoken';
import ErrorResponse from '@/utils/errorResponse';
import { JWT_SECRET } from '@secrets';

export const parseAuth = (req, _res, next) => {
  req.auth = {
    token: '',
    decoded: {},
  };

  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startWith('Bearer')) {
    [, token] = authorization.split(' ');
  }

  if (!token) {
    return next();
  }

  const decodedToken = jwt.verify(token, JWT_SECRET);
  req.auth.token = token;
  req.auth.decoded = decodedToken;

  return next();
};

export const requireAuth = redisClient => (req, _res, next) => {
  const { token } = req.auth;

  if (!token) {
    return next(new ErrorResponse('Unauthorized', 401));
  }

  return redisClient.get(token, (err, reply) => {
    if (err || !reply) {
      return next(new ErrorResponse('UNauthorized', 401));
    }
    return next();
  });
};

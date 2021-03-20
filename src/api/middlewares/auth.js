import jwt from 'express-jwt';
import config from '@/config';
import createError from 'http-errors';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';

const getTokenFromHeader = req => {
  const { authorization } = req.headers;
  if (
    authorization &&
    (authorization.startsWith('Bearer') || authorization.startsWith('Token'))
  ) {
    return authorization.split(' ')[1];
  }
  return null;
};

const verifyTokenSub = sub => (req, _res, next) => {
  if (req.token.sub === sub) {
    return next();
  }
  return next(createError(401, 'Unauthorized'));
};

export const isRefreshToken = verifyTokenSub(REFRESH_TOKEN);
export const isAccessToken = verifyTokenSub(ACCESS_TOKEN);

export const isAuth = jwt({
  secret: config.jwt.secret,
  algorithms: [config.jwt.algorithm],
  userProperty: 'token',
  getToken: getTokenFromHeader,
});

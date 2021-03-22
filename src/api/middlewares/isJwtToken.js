import createHttpError from 'http-errors';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';

const verifyTokenSub = sub => (req, _res, next) => {
  if (req.token.sub === sub) {
    return next();
  }
  return next(createHttpError(401, 'Unauthorized'));
};

export const isRefreshToken = verifyTokenSub(REFRESH_TOKEN);
export const isAccessToken = verifyTokenSub(ACCESS_TOKEN);

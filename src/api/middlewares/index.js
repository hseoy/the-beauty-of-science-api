import { isAuth, isRefreshToken, isAccessToken } from './auth';

const middlewares = {
  isAuth,
  isRefreshToken,
  isAccessToken,
};

export default middlewares;

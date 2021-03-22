import { isRefreshToken, isAccessToken } from './isJwtToken';
import isAuth from './isAuth';

const middlewares = {
  isAuth,
  isRefreshToken,
  isAccessToken,
};

export default middlewares;

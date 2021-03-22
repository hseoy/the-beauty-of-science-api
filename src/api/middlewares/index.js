import { isRefreshToken, isAccessToken } from './isJwtToken';
import isAuth from './isAuth';
import attachCurrentUser from './attachCurrentUser';

const middlewares = {
  isAuth,
  isRefreshToken,
  isAccessToken,
  attachCurrentUser,
};

export default middlewares;

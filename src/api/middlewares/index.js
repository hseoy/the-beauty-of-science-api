import { isRefreshToken, isAccessToken } from './isJwtToken';
import isAuth from './isAuth';
import attachCurrentUser from './attachCurrentUser';
import uploadFile from './uploadFile';

const middlewares = {
  isAuth,
  isRefreshToken,
  isAccessToken,
  attachCurrentUser,
  uploadFile,
};

export default middlewares;

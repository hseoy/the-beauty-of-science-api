import { Container } from 'typedi';
import AuthService from '@/services/auth';

const handleSignUp = async (req, res, next) => {
  try {
    const authServiceInstance = Container.get(AuthService);
    const authHelper = Container.get('authHelper');

    const { access, refresh } = await authServiceInstance.SignUp(req.body);

    res.cookie('X-Refresh-Token', refresh, {
      expires: new Date(Date.now() + authHelper.getRefreshExpiresInMs()),
      secure: false,
      httpOnly: true,
    });
    return res.status(201).json({ access });
  } catch (e) {
    return next(e);
  }
};

const handleSignIn = async (req, res, next) => {
  try {
    const authServiceInstance = Container.get(AuthService);
    const authHelper = Container.get('authHelper');

    const { access, refresh } = await authServiceInstance.SignIn(req.body);

    res.cookie('X-Refresh-Token', refresh, {
      expires: new Date(Date.now() + authHelper.getRefreshExpiresInMs()),
      secure: false,
      httpOnly: true,
    });
    return res.status(200).json({ access });
  } catch (e) {
    return next(e);
  }
};

const handleSignOut = async (req, res, next) => {
  try {
    const authServiceInstance = Container.get(AuthService);
    const refreshToken = req.cookies['X-Refresh-Token'];

    await authServiceInstance.SignOut(refreshToken);

    res.clearCookie('X-Refresh-Token');
    return res.status(200).end();
  } catch (e) {
    return next(e);
  }
};

const handleRefresh = async (req, res, next) => {
  try {
    const authServiceInstance = Container.get(AuthService);

    const refreshToken = req.cookies['X-Refresh-Token'];
    const accessToken = req.headers.authorization.split(' ')[1];

    const { access } = await authServiceInstance.RefreshAccessToken(
      refreshToken,
      accessToken,
    );

    return res.status(200).json({ access });
  } catch (e) {
    return next(e);
  }
};

const authController = {
  handleSignUp,
  handleSignIn,
  handleSignOut,
  handleRefresh,
};

export default authController;

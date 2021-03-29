import { Container } from 'typedi';
import AuthService from '@/services/auth';

const handleSignUp = async (req, res, next) => {
  try {
    const authServiceInstance = Container.get(AuthService);
    const token = await authServiceInstance.SignUp(req.body);
    return res.status(201).json({ token });
  } catch (e) {
    return next(e);
  }
};

const handleSignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const authServiceInstance = Container.get(AuthService);
    const token = await authServiceInstance.SignIn(email, password);
    return res.status(200).json({ token });
  } catch (e) {
    return next(e);
  }
};

const handleSignOut = async (req, res, next) => {
  try {
    const authServiceInstance = Container.get(AuthService);
    const token = req.headers.authorization.split(' ')[1];
    await authServiceInstance.SignOut(token);
    return res.status(200).end();
  } catch (e) {
    return next(e);
  }
};

const handleRefresh = async (req, res, next) => {
  const authServiceInstance = Container.get(AuthService);

  try {
    const { access } = req.body;
    const refresh = req.headers.authorization.split(' ')[1];
    const token = await authServiceInstance.RefreshAccessToken(refresh, access);

    return res.status(200).json({ token });
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

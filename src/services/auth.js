import { Container, Service } from 'typedi';
import createError from 'http-errors';

@Service()
export default class AuthService {
  userModel = Container.get('userModel');

  authHelper = Container.get('authHelper');

  async Signup({ username, email, password }) {
    const result = {};

    const hashedPw = this.authHelper.generateHash(password);

    await this.userModel.transactionStart();
    try {
      await this.userModel.createUserLogin(email, hashedPw);
      [result.user] = await this.userModel.createUser(email, username);
      const token = this.authHelper.generateToken(result.user);
      await this.authHelper.storeRefreshToken(token.refresh, email);
      await this.userModel.transactionCommit();
      result.token = token;
    } catch (e) {
      await this.userModel.transactionRollback();
      console.log(e);
      throw createError(400, 'unable to signup');
    }

    return result;
  }

  async SignIn(email, password) {
    try {
      const [hash] = await this.userModel.findPasswordByEmail(email);
      const isValid = this.authHelper.comparePassword(hash.password, password);

      if (isValid) {
        const [user] = await this.userModel.findByEmail(email);
        const { access, refresh } = this.authHelper.generateToken(user);
        await this.authHelper.storeRefreshToken(refresh, email);
        return { user, token: { access, refresh } };
      }
    } catch (e) {
      throw createError(400, 'unable to signin');
    }
    return null;
  }

  async SignOut(token) {
    try {
      await this.authHelper.deleteRefreshToken(token);
    } catch {
      throw createError(400, 'unable to signout');
    }
  }

  async RefreshAccessToken(token, email) {
    const [user] = await this.userModel.findByEmail(email);
    const isValid =
      user && (await this.authHelper.verifyRefreshToken(token, email));
    if (isValid) {
      const { access } = this.authHelper.generateToken(
        { email },
        { access: true, refresh: false },
      );
      return { access };
    }
    throw createError(401, 'Unauthorized');
  }
}

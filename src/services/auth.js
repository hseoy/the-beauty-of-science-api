import { Container, Service } from 'typedi';
import createHttpError from 'http-errors';

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

      const access = this.authHelper.generateAccessToken(result.user);
      const refresh = this.authHelper.generateRefreshToken();
      result.token = { access, refresh };

      await this.authHelper.storeRefreshToken(refresh, result.user.id);

      await this.userModel.transactionCommit();
    } catch (e) {
      await this.userModel.transactionRollback();
      console.log(e);
      throw createHttpError(400, 'unable to signup');
    }

    return result;
  }

  async SignIn(email, password) {
    try {
      const [hash] = await this.userModel.findPasswordByEmail(email);
      const isValid = this.authHelper.comparePassword(hash.password, password);

      if (isValid) {
        const [user] = await this.userModel.findByEmail(email);

        const access = this.authHelper.generateAccessToken(user);
        const refresh = this.authHelper.generateRefreshToken();

        await this.authHelper.storeRefreshToken(refresh, user.id);

        return { user, token: { access, refresh } };
      }
    } catch (e) {
      console.error(e);
      throw createHttpError(400, 'unable to signin');
    }
    return null;
  }

  async SignOut(token) {
    try {
      await this.authHelper.deleteRefreshToken(token);
    } catch {
      throw createHttpError(400, 'unable to signout');
    }
  }

  async RefreshAccessToken(refreshToken, accessToken) {
    try {
      const { id } = this.authHelper.decodeAccessToken(accessToken);
      const [user] = await this.userModel.findById(id);
      const isValid =
        user && (await this.authHelper.verifyRefreshToken(refreshToken, id));
      if (isValid) {
        const access = this.authHelper.generateAccessToken(user);
        return { access };
      }
    } catch (e) {
      console.error(e);
    }
    throw createHttpError(401, 'Unauthorized');
  }
}

import { Service, Inject } from 'typedi';
import createHttpError from 'http-errors';

@Service()
export default class AuthService {
  @Inject('userModel')
  userModel;

  @Inject('userLoginModel')
  userLoginModel;

  @Inject('authHelper')
  authHelper;

  constructor({ authHelper, userModel, userLoginModel } = {}) {
    this.authHelper = authHelper;
    this.userModel = userModel;
    this.userLoginModel = userLoginModel;
  }

  async SignUp({ username, email, password }) {
    const exists = await this.userModel.findBy({ email });
    if (exists.length > 0) {
      throw createHttpError(409, 'account already exists');
    }

    if (!this.authHelper.passwordValidate(password)) {
      throw createHttpError(400, 'invalid password');
    }

    const trx = await this.userModel.transaction();
    try {
      await this.userModel.transactionStartWithTrx(trx);
      await this.userLoginModel.transactionStartWithTrx(trx);

      const [createdUser] = await this.userModel.create({ email, username });

      const hashedPw = this.authHelper.generateHash(password);
      await this.userLoginModel.create({
        userid: createdUser.id,
        password: hashedPw,
      });

      const access = this.authHelper.generateAccessToken(createdUser);
      const refresh = this.authHelper.generateRefreshToken(createdUser);

      await this.authHelper.storeRefreshToken(refresh, createdUser.id);
      await this.userModel.transactionCommit();

      return { access, refresh };
    } catch (e) {
      await this.userModel.transactionRollback();
      throw createHttpError(400, 'unable to signup');
    }
  }

  async SignIn({ email, password }) {
    try {
      const [user] = await this.userModel.findBy({ email });
      const [hash] = await this.userLoginModel.findBy({ userid: user.id });
      const isValid = this.authHelper.comparePassword(hash.password, password);

      if (isValid) {
        const access = this.authHelper.generateAccessToken(user);
        const refresh = this.authHelper.generateRefreshToken(user);

        await this.authHelper.storeRefreshToken(refresh, user.id);

        return { access, refresh };
      }
      return null;
    } catch (e) {
      throw createHttpError(400, 'unable to signin');
    }
  }

  async SignOut(token) {
    try {
      await this.authHelper.deleteRefreshToken(token);
    } catch {
      throw createHttpError(400, 'unable to signout');
    }
  }

  async RefreshAccessToken(refreshToken) {
    try {
      const { id } = this.authHelper.decodeRefreshToken(refreshToken);
      const [user] = await this.userModel.findBy({ id });
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

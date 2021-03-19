import { Container, Service } from 'typedi';
import config from '@/config';
import jwt from 'jsonwebtoken';

@Service()
export default class AuthService {
  userModel = Container.get('userModel');

  bcrypt = Container.get('bcrypt');

  async Signup({ username, email, password }) {
    const result = {};

    const saltRounds = 10;
    const hashedPw = this.bcrypt.hashSync(password, saltRounds);

    await this.userModel.transactionStart();
    try {
      await this.userModel.createUserLogin(email, hashedPw);
      [result.user] = await this.userModel.createUser(email, username);
      result.token = AuthService.generateToken(result.user);
      await this.userModel.transactionCommit();
    } catch (e) {
      console.log('ERROR', e);
      await this.userModel.transactionRollback();
      throw new Error('unable to signup');
    }

    return result;
  }

  async SignIn(email, password) {
    try {
      const [hash] = await this.userModel.findPasswordByEmail(email);
      const isValid =
        password && this.bcrypt.compareSync(password, hash.password);

      if (isValid) {
        const [user] = await this.userModel.findByEmail(email);
        const token = AuthService.generateToken(user);
        return { user, token };
      }
    } catch (e) {
      console.log(e);
      throw new Error('unable to signin');
    }
    return null;
  }

  static generateToken({ id, username, email }) {
    const jwtPayload = { id, username, email };
    const expiresIn = { expiresIn: config.jwt.expire };
    return jwt.sign(jwtPayload, config.jwt.secret, expiresIn);
  }
}

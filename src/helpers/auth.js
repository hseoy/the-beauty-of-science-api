import config from '@/config';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { Container } from 'typedi';

const generateToken = (
  { email },
  options = { access: true, refresh: true },
) => {
  const result = {};
  if (options.access) {
    const accessToken = jwt.sign({ email }, config.jwt.secret, {
      algorithm: config.jwt.algorithm,
      expiresIn: 60 * 60 * config.jwt.expire.access,
      subject: 'ACCESS_TOKEN',
    });
    result.access = accessToken;
  }
  if (options.refresh) {
    const refreshToken = jwt.sign({ email }, config.jwt.secret, {
      algorithm: config.jwt.algorithm,
      expiresIn: 60 * 60 * config.jwt.expire.refresh,
      subject: 'REFRESH_TOKEN',
    });
    result.refresh = refreshToken;
  }
  return result;
};

const generateHash = password => {
  const bcrypt = Container.get('bcrypt');
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

const comparePassword = (hashedPw, password) => {
  const bcrypt = Container.get('bcrypt');
  return password && bcrypt.compareSync(password, hashedPw);
};

const storeRefreshToken = (refresh, email) => {
  const redisClient = Container.get('redisClient');
  const setAsync = promisify(redisClient.set).bind(redisClient);
  return setAsync(refresh, email, 'EX', 60 * 60 * config.jwt.expire.refresh);
};

const deleteRefreshToken = refresh => {
  const redisClient = Container.get('redisClient');
  const delAsync = promisify(redisClient.del).bind(redisClient);
  return delAsync(refresh);
};

const verifyRefreshToken = async (token, email) => {
  const redisClient = Container.get('redisClient');
  const getAsync = promisify(redisClient.get).bind(redisClient);
  const res = await getAsync(token);
  return res === email;
};

const authHelper = {
  generateToken,
  generateHash,
  comparePassword,
  storeRefreshToken,
  deleteRefreshToken,
  verifyRefreshToken,
};

export default authHelper;

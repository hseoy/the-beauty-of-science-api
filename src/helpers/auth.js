import config from '@/config';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { Container } from 'typedi';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';
import PasswordValidator from 'password-validator';

const generateToken = (subject, expSeconds) => {
  const { algorithm } = config.jwt;
  const expiresIn = 60 * 60 * expSeconds;
  const jwtOption = { algorithm, expiresIn, subject };

  if (subject === ACCESS_TOKEN) {
    return ({ id, username }) =>
      jwt.sign({ id, username }, config.jwt.secret, jwtOption);
  }
  if (subject === REFRESH_TOKEN) {
    return ({ id }) => jwt.sign({ id }, config.jwt.secret, jwtOption);
  }
  return () => jwt.sign({}, config.jwt.secret, jwtOption);
};

const generateAccessToken = generateToken(
  ACCESS_TOKEN,
  config.jwt.expire.access,
);

const generateRefreshToken = generateToken(
  REFRESH_TOKEN,
  config.jwt.expire.refresh,
);

const getJwtExpiresIn = (type, time = 's') => {
  let expire = 0;
  if (type === REFRESH_TOKEN) {
    expire = 60 * 60 * config.jwt.expire.refresh;
  }
  if (type === ACCESS_TOKEN) {
    expire = 60 * 60 * config.jwt.expire.access;
  }
  if (time === 'ms') {
    expire *= 1000;
  }
  return expire;
};

const getAccessExpiresIn = () => getJwtExpiresIn(ACCESS_TOKEN);
const getRefreshExpiresIn = () => getJwtExpiresIn(REFRESH_TOKEN);
const getAccessExpiresInMs = () => getJwtExpiresIn(ACCESS_TOKEN, 'ms');
const getRefreshExpiresInMs = () => getJwtExpiresIn(REFRESH_TOKEN, 'ms');

const decodeToken = subject => token => {
  const decode = jwt.verify(token, config.jwt.secret, {
    algorithms: [config.jwt.algorithm],
    subject,
  });
  return decode;
};

const decodeAccessToken = decodeToken(ACCESS_TOKEN);
const decodeRefreshToken = decodeToken(REFRESH_TOKEN);

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

const storeRefreshToken = (refresh, id) => {
  const redisClient = Container.get('redisClient');
  const setAsync = promisify(redisClient.set).bind(redisClient);
  return setAsync(refresh, id, 'EX', 60 * 60 * config.jwt.expire.refresh);
};

const deleteRefreshToken = refresh => {
  const redisClient = Container.get('redisClient');
  const delAsync = promisify(redisClient.del).bind(redisClient);
  return delAsync(refresh);
};

const verifyRefreshToken = async (token, id) => {
  const redisClient = Container.get('redisClient');
  const getAsync = promisify(redisClient.get).bind(redisClient);
  const res = await getAsync(token);
  return parseInt(res, 10) === parseInt(id, 10);
};

const passwordSchema = new PasswordValidator();
passwordSchema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .letters() // Must have  letters
  .has()
  .symbols(2) // Must have at least 2 symbols
  .has()
  .not()
  .spaces(); // Should not have spaces

const passwordValidate = pw => {
  return passwordSchema.validate(pw);
};

const authHelper = {
  generateAccessToken,
  generateRefreshToken,
  getAccessExpiresIn,
  getRefreshExpiresIn,
  getAccessExpiresInMs,
  getRefreshExpiresInMs,
  decodeAccessToken,
  decodeRefreshToken,
  generateHash,
  comparePassword,
  storeRefreshToken,
  deleteRefreshToken,
  verifyRefreshToken,
  passwordValidate,
};

export default authHelper;

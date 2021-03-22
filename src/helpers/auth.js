import config from '@/config';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { Container } from 'typedi';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';

const generateToken = (subject, expSeconds, hasPayload) => {
  const { algorithm } = config.jwt;
  const expiresIn = 60 * 60 * expSeconds;
  const jwtOption = { algorithm, expiresIn, subject };

  return hasPayload
    ? ({ id, username }) =>
        jwt.sign({ id, username }, config.jwt.secret, jwtOption)
    : () => jwt.sign({}, config.jwt.secret, jwtOption);
};

const generateAccessToken = generateToken(
  ACCESS_TOKEN,
  config.jwt.expire.access,
  true,
);

const generateRefreshToken = generateToken(
  REFRESH_TOKEN,
  config.jwt.expire.refresh,
  false,
);

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

const authHelper = {
  generateAccessToken,
  generateRefreshToken,
  decodeAccessToken,
  decodeRefreshToken,
  generateHash,
  comparePassword,
  storeRefreshToken,
  deleteRefreshToken,
  verifyRefreshToken,
};

export default authHelper;

import jwt from 'jsonwebtoken';
import { JWT_EXPIRE, JWT_SECRET, JWT_COOKIE_EXPIRE } from '@secrets';
import ErrorResponse from '@/utils/errorResponse';

const signToken = (id, userid) => {
  const jwtPayload = { id, userid };
  const expiresIn = { expiresIn: JWT_EXPIRE };
  return jwt.sign(jwtPayload, JWT_SECRET, expiresIn);
};

const setToken = redisClient => (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
};

const createSession = redisClient => user => {
  const { id, userid } = user;
  const token = signToken(id, userid);
  return setToken(redisClient)(token, id)
    .then(() => ({ success: true, id, token }))
    .catch(err => new ErrorResponse(err, 401));
};

const sendTokenResponse = (data, statusCode, res) => {
  const options = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  return res.status(statusCode).cookie('token', data.token, options).json(data);
};

const handleSignIn = (db, bcrypt, req) => {
  const { userid, userpw } = req.body;

  if (!userid || !userpw) {
    return Promise.reject(new ErrorResponse('incorrect form submission', 400));
  }

  return db
    .select('userid', 'userhash')
    .from('users_login')
    .where('userid', '=', userid)
    .then(data => {
      const isValid =
        data[0].userhash && bcrypt.compareSync(userpw, data[0].userhash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('userid', '=', userid)
          .then(user => (user[0] ? user[0] : Promise.reject()))
          .catch(_err =>
            Promise.reject(new ErrorResponse('unable to get user', 400)),
          );
      }
      return Promise.reject(new ErrorResponse('wrong credentials', 400));
    })
    .catch(_err => Promise.reject(new ErrorResponse('wrong credentials', 400)));
};

const getAuthTokenId = redisClient => (req, res, next) => {
  const { token } = req.auth;

  return redisClient.get(token, (err, reply) => {
    if (err || !reply) {
      return next(new ErrorResponse('Unauthorized', 401));
    }
    return res.json({ success: true, id: reply });
  });
};

const signinAuth = (db, bcrypt, redisClient) => (req, res, next) => {
  const { token } = req.auth;

  return token
    ? getAuthTokenId(redisClient)(req, res, next)
    : handleSignIn(db, bcrypt, req)
        .then(data =>
          data.id && data.userid
            ? createSession(redisClient)(data)
            : Promise.reject(data),
        )
        .then(session => sendTokenResponse(session, 200, res))
        .catch(err => next(err));
};

export default signinAuth;

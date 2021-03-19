process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  port: parseInt(process.env.PORT, 10) || 5000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '30d',
    cookieExpire: process.env.JWT_COOKIE_EXPIRE || '30',
  },
  database: {
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
    },
    postgres: {
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME,
    },
  },
  api: {
    prefix: '/api',
  },
};

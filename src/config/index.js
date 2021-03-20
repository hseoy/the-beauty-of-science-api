process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  port: parseInt(process.env.PORT, 10) || 5000,
  jwt: {
    algorithm: process.env.JWT_ALGORITHM,
    secret: process.env.JWT_SECRET,
    expire: {
      access: parseFloat(process.env.JWT_EXPIRE_ACCESS),
      refresh: parseFloat(process.env.JWT_EXPIRE_REFRESH),
    },
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

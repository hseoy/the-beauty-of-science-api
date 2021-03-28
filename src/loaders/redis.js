import redis from 'redis';
import config from '@/config';

export default () => {
  if (process.env.NODE_ENV === 'production') {
    return redis.createClient(config.database.redis.connectionTlsUrl, {
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  if (process.env.NODE_ENV === 'development') {
    return redis.createClient({
      host: config.database.redis.host,
      port: config.database.redis.port,
    });
  }
  throw new Error(`Unknown NODE_ENV(${process.env.NODE_ENV}`);
};

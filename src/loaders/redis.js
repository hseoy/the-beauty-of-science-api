import redis from 'redis';
import config from '@/config';

export default () => {
  return redis.createClient({
    host: config.database.redis.host,
    port: config.database.redis.port,
  });
};

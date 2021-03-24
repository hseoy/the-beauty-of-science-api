import { UserModel } from '@/models';
import bcrypt from 'bcrypt';
import authHelper from '@/helpers/auth';
import userHelper from '@/helpers/user';
import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import postgresLoader from './postgres';
import redisLoader from './redis';

export default ({ expressApp }) => {
  const db = postgresLoader();
  console.info('✌️  Postgres loaded and connected!');

  const redisClient = redisLoader();
  console.log('✌️  Redis loaded and connected!');

  dependencyInjectorLoader.prepare({ db, redisClient, bcrypt });

  const helpers = [
    { name: 'authHelper', helper: authHelper },
    { name: 'userHelper', helper: userHelper },
  ];
  dependencyInjectorLoader.helpers(helpers);

  const userModel = { name: 'userModel', model: new UserModel() };
  dependencyInjectorLoader.models([userModel]);
  console.info('✌️  Dependency Injector loaded');

  expressLoader({ app: expressApp });
  console.info('✌️  Express loaded');
};

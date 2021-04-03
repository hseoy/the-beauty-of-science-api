import bcrypt from 'bcrypt';
import models from '@/models';
import helpers from '@/helpers';
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

  const helperList = Object.keys(helpers).map(helper => ({
    name: helper,
    helper: helpers[helper],
  }));
  dependencyInjectorLoader.helpers(helperList);

  const modelList = [
    { name: 'userModel', model: new models.UserModel() },
    { name: 'userAvatarModel', model: new models.UserAvatarModel() },
    { name: 'userLoginModel', model: new models.UserLoginModel() },
    { name: 'postModel', model: new models.PostModel() },
    { name: 'postCommentModel', model: new models.PostCommentModel() },
    { name: 'postScoreModel', model: new models.PostScoreModel() },
  ];
  dependencyInjectorLoader.models(modelList);
  console.info('✌️  Dependency Injector loaded');

  expressLoader({ app: expressApp });
  console.info('✌️  Express loaded');
};

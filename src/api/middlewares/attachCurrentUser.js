import createHttpError from 'http-errors';
import { Container } from 'typedi';

const attachCurrentUser = async (req, _res, next) => {
  try {
    const userModel = Container.get('userModel');
    const [user] = await userModel.findBy({ id: req.token.id });
    if (!user) {
      return next(createHttpError(401, 'Unauthorized'));
    }
    req.currentUser = user;
    return next();
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

export default attachCurrentUser;

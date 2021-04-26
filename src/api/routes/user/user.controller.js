import { Container } from 'typedi';
import UserService from '@/services/user';

const handleGetUserIds = async (_req, res, next) => {
  try {
    const userServiceInstance = Container.get(UserService);
    const userIds = await userServiceInstance.findAllUserIds();
    return res.status(200).json(userIds);
  } catch (e) {
    return next(e);
  }
};

const handleGetUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userServiceInstance = Container.get(UserService);
    const user = await userServiceInstance.findUser(id);
    return res.status(200).json(user);
  } catch (e) {
    return next(e);
  }
};

const handleGetCurrentUser = async (req, res) => {
  return res.status(200).json(req.currentUser);
};

const handleUpdateCurrentUser = async (req, res, next) => {
  try {
    const { user } = req.body;
    const userServiceInstance = Container.get(UserService);
    const updatedUser = await userServiceInstance.updatedUser(
      req.currentUser.id,
      user,
    );
    return res.status(200).json(updatedUser);
  } catch (e) {
    return next(e);
  }
};

const handleDeleteCurrentUser = async (req, res, next) => {
  try {
    const userServiceInstance = Container.get(UserService);
    await userServiceInstance.deleteUser(req.currentUser.id);
    return res.status(200).end();
  } catch (e) {
    return next(e);
  }
};

const handleGetCurrentUserAvatar = async (req, res, next) => {
  try {
    const userServiceInstance = Container.get(UserService);
    const avatar = await userServiceInstance.getAvatarFile(req.currentUser.id);
    return res.status(200).type(avatar.mimetype).sendFile(avatar.path);
  } catch (e) {
    return next(e);
  }
};

const handleGetUserAvatar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userServiceInstance = Container.get(UserService);
    const avatar = await userServiceInstance.getAvatarFile(id);
    return res.status(200).type(avatar.mimetype).sendFile(avatar.path);
  } catch (e) {
    return next(e);
  }
};

const handleUpdateAvatar = async (req, res, next) => {
  try {
    const userServiceInstance = Container.get(UserService);
    await userServiceInstance.updateAvatar(req.file, req.currentUser.id);
    return res.status(200).end();
  } catch (e) {
    return next(e);
  }
};

const handleDeleteAvatar = async (req, res, next) => {
  try {
    const userServiceInstance = Container.get(UserService);
    await userServiceInstance.deleteAvatar(req.currentUser.id);
    return res.status(200).end();
  } catch (e) {
    return next(e);
  }
};

const userController = {
  handleGetUserIds,
  handleGetUser,
  handleGetCurrentUser,
  handleUpdateCurrentUser,
  handleDeleteCurrentUser,
  handleGetCurrentUserAvatar,
  handleGetUserAvatar,
  handleUpdateAvatar,
  handleDeleteAvatar,
};

export default userController;

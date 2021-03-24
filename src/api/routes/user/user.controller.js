import { Container } from 'typedi';
import UserService from '@/services/user';

const handleGetUserIds = async (_req, res) => {
  const userServiceInstance = Container.get(UserService);
  const userIds = await userServiceInstance.findAllUserIds();
  return res.status(200).json({ users: userIds });
};

const handleGetUser = async (req, res) => {
  const { id } = req.param;
  const userServiceInstance = Container.get(UserService);
  const user = await userServiceInstance.findUser(id);
  return res.status(200).json({ user });
};

const handleGetCurrentUser = async (req, res) => {
  return res.status(200).json({ user: req.currentUser });
};

const handleUpdateCurrentUser = async (req, res) => {
  const { user } = req.body;
  const userServiceInstance = Container.get(UserService);
  const updatedUser = await userServiceInstance.updatedUser(
    req.currentUser.id,
    user,
  );
  return res.status(200).json({ user: updatedUser });
};

const handleDeleteCurrentUser = async (req, res) => {
  const userServiceInstance = Container.get(UserService);
  await userServiceInstance.deleteUser(req.currentUser.id);
  return res.status(200).end();
};

const handleGetCurrentUserAvatar = async (req, res) => {
  const userServiceInstance = Container.get(UserService);
  const avatar = await userServiceInstance.getAvatarFileByEmail(
    req.currentUser.email,
  );
  return res.status(200).type(avatar.mimetype).sendFile(avatar.path);
};

const handleGetUserAvatar = async (req, res) => {
  const { id } = req.param;
  const userServiceInstance = Container.get(UserService);
  const avatar = await userServiceInstance.getAvatarFileById(id);
  return res.status(200).type(avatar.mimetype).sendFile(avatar.path);
};

const handleUpdateAvatar = async (req, res) => {
  const userServiceInstance = Container.get(UserService);
  await userServiceInstance.updateAvatar(req.file, req.currentUser.email);
  res.status(200).end();
};

const handleDeleteAvatar = async (req, res) => {
  const userServiceInstance = Container.get(UserService);
  await userServiceInstance.deleteAvatar(req.currentUser.email);
  res.status(200).end();
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

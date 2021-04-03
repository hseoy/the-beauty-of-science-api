import UserService from '@/services/user';
import createHttpError from 'http-errors';

describe('User service unit tests', () => {
  describe('UserService constructor tests', () => {
    const userServiceInstance = new UserService();

    it('<UserService.constructor> properties are undefined', () => {
      expect(userServiceInstance.userHelper).toBeUndefined();
      expect(userServiceInstance.userModel).toBeUndefined();
      expect(userServiceInstance.userAvatarModel).toBeUndefined();
      expect(userServiceInstance.postModel).toBeUndefined();
      expect(userServiceInstance.postScoreModel).toBeUndefined();
    });
  });

  describe('UserService.findAllUserIds method tests', () => {
    const userModel = { findAll: jest.fn() };
    const userServiceInstance = new UserService({ userModel });

    it('<UserService.findAllUserIds> returns user id array', async () => {
      const userList = [{ id: 1 }, { id: 2 }, { id: 3 }];
      userModel.findAll.mockResolvedValue(userList);
      const res = await userServiceInstance.findAllUserIds();
      expect(res).toEqual([1, 2, 3]);
    });

    it('<UserService.findAllUserIds> throw http error(unable to find users)', async () => {
      userModel.findAll.mockRejectedValue(new Error('ERROR'));
      await expect(userServiceInstance.findAllUserIds()).rejects.toThrow(
        createHttpError(400, 'unable to find users'),
      );
    });
  });

  describe('UserService.findUser method tests', () => {
    const userModel = { findBy: jest.fn() };
    const userServiceInstance = new UserService({ userModel });

    it('<UserService.findUser> returns user object', async () => {
      const user = { id: 1 };
      userModel.findBy.mockResolvedValue([user]);
      const res = await userServiceInstance.findUser(1);
      expect(res).toEqual(user);
    });

    it('<UserService.findUser> throw http error(unable to find user)', async () => {
      userModel.findBy.mockRejectedValue(new Error('ERROR'));
      await expect(userServiceInstance.findUser()).rejects.toThrow(
        createHttpError(400, 'unable to find user'),
      );
    });
  });

  describe('UserService.updateUser method tests', () => {
    const userModel = { updateWith: jest.fn() };
    const userServiceInstance = new UserService({ userModel });

    it('<UserService.updateUser> returns updated user object', async () => {
      const updatedUser = { id: 1, username: 'updated' };
      userModel.updateWith.mockResolvedValue([updatedUser]);
      const res = await userServiceInstance.updateUser(1, updatedUser);
      expect(res).toEqual(updatedUser);
    });

    it('<UserService.updateUser> throw http error(unable to update user)', async () => {
      userModel.updateWith.mockRejectedValue(new Error('ERROR'));
      await expect(userServiceInstance.updateUser()).rejects.toThrow(
        createHttpError(400, 'unable to update user'),
      );
    });
  });

  describe('UserService.deleteUser method tests', () => {
    const model = {
      transaction: jest.fn(),
      transactionStartWithTrx: jest.fn(),
      transactionCommit: jest.fn(),
      transactionRollback: jest.fn(),
      findBy: jest.fn(),
      deleteBy: jest.fn(),
    };
    const userModel = { ...model };
    const userAvatarModel = { ...model };
    const postModel = { ...model };
    const postScoreModel = { ...model };
    const userHelper = { deleteAvatarFile: jest.fn() };
    const userServiceInstance = new UserService({
      userHelper,
      userModel,
      userAvatarModel,
      postModel,
      postScoreModel,
    });

    it('<UserService.deleteUser> does not return', async () => {
      userAvatarModel.findBy.mockResolvedValue([{ filepath: '' }]);
      const res = await userServiceInstance.deleteUser(1);
      expect(res).toBeUndefined();
    });

    it('<UserService.deleteUser> throw http error(unable to delete user)', async () => {
      model.deleteBy.mockRejectedValue(new Error('ERROR'));
      await expect(userServiceInstance.deleteUser()).rejects.toThrow(
        createHttpError(400, 'unable to delete user'),
      );
    });
  });

  describe('UserService.getAvatarFileBy methods test', () => {
    const mockAvatar = {
      userid: 1,
      mimetype: 'image/jpeg',
      filepath: 'avatar/e2bf468275',
    };
    const avatarFilePath = '/project/avatar/e2bf468275';

    const userHelper = { getAvatarFilePath: jest.fn() };
    const userAvatarModel = { findBy: jest.fn() };
    const userServiceInstance = new UserService({
      userAvatarModel,
      userHelper,
    });

    it('<UserService.getAvatarFile> returns avatar file object', async () => {
      userAvatarModel.findBy.mockResolvedValue([mockAvatar]);
      userHelper.getAvatarFilePath.mockReturnValueOnce(avatarFilePath);
      const res = await userServiceInstance.getAvatarFile(mockAvatar.userid);
      expect(res).toEqual({
        mimetype: mockAvatar.mimetype,
        path: avatarFilePath,
      });
    });

    it('<UserService.getAvatarFile> throw http error(unable to get avatar image)', async () => {
      userAvatarModel.findBy.mockRejectedValue(new Error('ERROR'));
      await expect(userServiceInstance.getAvatarFile(1)).rejects.toThrow(
        createHttpError(400, 'unable to get avatar image'),
      );
    });
  });

  describe('UserService.updateAvatar method tests', () => {
    const userAvatarModel = { updateWith: jest.fn(), findBy: jest.fn() };
    const userHelper = { deleteAvatarFile: jest.fn() };
    const userServiceInstance = new UserService({
      userAvatarModel,
      userHelper,
    });
    const mockFile = {
      filename: 'e2bf468275',
      mimetype: 'image/jpeg',
      size: 100,
      path: 'avatar/e2bf468275',
    };

    it('<UserService.updateAvatar> does not return', async () => {
      userAvatarModel.findBy.mockResolvedValue([
        { filepath: 'avatar/e2bf468275' },
      ]);
      userAvatarModel.updateWith.mockResolvedValue(mockFile);
      const res = await userServiceInstance.updateAvatar(mockFile, 1);
      expect(res).toMatchObject(mockFile);
    });

    it('<UserService.updateAvatar> throw http error(unable to update avatar)', async () => {
      userAvatarModel.findBy.mockRejectedValue(new Error('ERROR'));
      await expect(
        userServiceInstance.updateAvatar(mockFile, 1),
      ).rejects.toThrow(createHttpError(400, 'unable to update avatar'));
    });
  });

  describe('UserService.deleteAvatar method tests', () => {
    const userAvatarModel = {
      findBy: jest.fn(),
      deleteBy: jest.fn(),
    };
    const userHelper = { deleteAvatarFile: jest.fn() };
    const userServiceInstance = new UserService({
      userAvatarModel,
      userHelper,
    });

    it('<UserService.deleteAvatar> does not return', async () => {
      userAvatarModel.findBy.mockResolvedValue([
        { filepath: 'avatar/e2bf468275' },
      ]);
      const res = await userServiceInstance.deleteAvatar(1);
      expect(res).toBeUndefined();
    });

    it('<UserService.deleteAvatar> throw http error(unable to delete avatar)', async () => {
      userAvatarModel.findBy.mockRejectedValue(new Error('ERROR'));
      await expect(userServiceInstance.deleteAvatar(1)).rejects.toThrow(
        createHttpError(400, 'unable to delete avatar'),
      );
    });
  });
});

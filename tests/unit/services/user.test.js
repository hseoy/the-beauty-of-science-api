import UserService from '@/services/user';
import createHttpError from 'http-errors';
import { Container } from 'typedi';

describe('User service unit tests', () => {
  describe('UserService constructor tests', () => {
    Container.set('userHelper', {});
    Container.set('userModel', {});
    const userServiceInstance = new UserService();

    it('<UserService.constructor> dependency injection', () => {
      expect(typeof userServiceInstance).toBe(typeof {});
    });
  });

  describe('UserService.findAllUserIds method tests', () => {
    const userModel = { findAll: jest.fn() };
    const userServiceInstance = new UserService(userModel, {});

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
    const userModel = { findById: jest.fn() };
    const userServiceInstance = new UserService(userModel, {});

    it('<UserService.findUser> returns user object', async () => {
      const user = { id: 1 };
      userModel.findById.mockResolvedValue([user]);
      const res = await userServiceInstance.findUser(1);
      expect(res).toEqual(user);
    });

    it('<UserService.findUser> throw http error(unable to find user)', async () => {
      userModel.findById.mockRejectedValue(new Error('ERROR'));
      await expect(userServiceInstance.findUser()).rejects.toThrow(
        createHttpError(400, 'unable to find user'),
      );
    });
  });

  describe('UserService.updateUser method tests', () => {
    const userModel = { updateUserWithId: jest.fn() };
    const userServiceInstance = new UserService(userModel, {});

    it('<UserService.updateUser> returns updated user object', async () => {
      const updatedUser = { id: 1, username: 'updated' };
      userModel.updateUserWithId.mockResolvedValue([updatedUser]);
      const res = await userServiceInstance.updateUser(1, updatedUser);
      expect(res).toEqual(updatedUser);
    });

    it('<UserService.updateUser> throw http error(unable to update user)', async () => {
      userModel.updateUserWithId.mockRejectedValue(new Error('ERROR'));
      await expect(userServiceInstance.updateUser()).rejects.toThrow(
        createHttpError(400, 'unable to update user'),
      );
    });
  });

  describe('UserService.deleteUser method tests', () => {
    const userModel = { deleteById: jest.fn() };
    const userServiceInstance = new UserService(userModel, {});

    it('<UserService.deleteUser> does not return', async () => {
      const res = await userServiceInstance.deleteUser(1);
      expect(res).toBeUndefined();
    });

    it('<UserService.deleteUser> throw http error(unable to delete user)', async () => {
      userModel.deleteById.mockRejectedValue(new Error('ERROR'));
      await expect(userServiceInstance.deleteUser()).rejects.toThrow(
        createHttpError(400, 'unable to delete user'),
      );
    });
  });

  describe('UserService.getAvatarFileBy methods test', () => {
    const avatar = { mimetype: 'image/jpeg', filepath: 'avatar/e2bf468275' };
    const avatarFilePath = '/project/avatar/e2bf468275';
    const userHelper = { getAvatarFilePath: jest.fn() };
    const userModel = { findAvatarByEmail: jest.fn(), findById: jest.fn() };
    const userServiceInstance = new UserService(userModel, userHelper);

    it('<UserService.getAvatarFileByEmail> returns avatar file object', async () => {
      userHelper.getAvatarFilePath.mockReturnValueOnce(avatarFilePath);
      userModel.findAvatarByEmail.mockResolvedValue([avatar]);
      const res = await userServiceInstance.getAvatarFileByEmail('a@foo.com');
      expect(res).toEqual({
        mimetype: avatar.mimetype,
        path: avatarFilePath,
      });
    });

    it('<UserService.getAvatarFileByEmail> throw http error(unable to get avatar image)', async () => {
      userModel.findAvatarByEmail.mockRejectedValue(new Error('ERROR'));
      await expect(
        userServiceInstance.getAvatarFileByEmail('a@foo.com'),
      ).rejects.toThrow(createHttpError(400, 'unable to get avatar image'));
    });

    it('<UserService.getAvatarFileById> returns avatar file object', async () => {
      userHelper.getAvatarFilePath.mockReturnValueOnce(avatarFilePath);
      userModel.findAvatarByEmail.mockResolvedValue([avatar]);
      userModel.findById.mockResolvedValue([{ id: 1, email: 'a@foo.com' }]);
      const res = await userServiceInstance.getAvatarFileById(1);
      expect(res).toEqual({
        mimetype: avatar.mimetype,
        path: avatarFilePath,
      });
    });

    it('<UserService.getAvatarFileById> throw http error(unable to get avatar image)', async () => {
      userModel.findById.mockRejectedValue(new Error('ERROR'));
      await expect(userServiceInstance.getAvatarFileById(1)).rejects.toThrow(
        createHttpError(400, 'unable to get avatar image'),
      );
    });
  });

  describe('UserService.deleteBeforeAvatar method tests', () => {
    const userModel = { findAvatarByEmail: jest.fn() };
    const userHelper = { deleteAvatarFile: jest.fn() };
    const userServiceInstance = new UserService(userModel, userHelper);

    it('<UserService.deleteBeforeAvatar> does not return', async () => {
      userModel.findAvatarByEmail.mockResolvedValue([
        { filepath: 'avatar/e2bf468275' },
      ]);
      const res = await userServiceInstance.deleteBeforeAvatar('a@foo.com');
      expect(res).toBeUndefined();
    });

    it('<UserService.deleteBeforeAvatar> There are no avatars to delete', async () => {
      userModel.findAvatarByEmail.mockResolvedValue([]);
      const res = await userServiceInstance.deleteBeforeAvatar('a@foo.com');
      expect(res).toBeUndefined();
    });

    it('<UserService.deleteBeforeAvatar> throw error', async () => {
      userModel.findAvatarByEmail.mockRejectedValue(new Error('ERROR'));
      await expect(
        userServiceInstance.deleteBeforeAvatar('a@foo.com'),
      ).rejects.toThrow('ERROR');
    });
  });

  describe('UserService.updateAvatar method tests', () => {
    const userModel = { updateAvatar: jest.fn(), findAvatarByEmail: jest.fn() };
    const userHelper = { deleteAvatarFile: jest.fn() };
    const userServiceInstance = new UserService(userModel, userHelper);
    const file = {
      filename: 'e2bf468275',
      mimetype: 'image/jpeg',
      size: 100,
      path: 'avatar/e2bf468275',
    };

    it('<UserService.updateAvatar> does not return', async () => {
      userModel.findAvatarByEmail.mockResolvedValue([
        { filepath: 'avatar/e2bf468275' },
      ]);
      const res = await userServiceInstance.updateAvatar(file, 'a@foo.com');
      expect(res).toBeUndefined();
    });

    it('<UserService.updateAvatar> throw http error(unable to update avatar)', async () => {
      userModel.findAvatarByEmail.mockRejectedValue(new Error('ERROR'));
      await expect(
        userServiceInstance.updateAvatar(file, 'a@foo.com'),
      ).rejects.toThrow(createHttpError(400, 'unable to update avatar'));
    });
  });

  describe('UserService.deleteAvatar method tests', () => {
    const userModel = {
      deleteAvatarByEmail: jest.fn(),
      findAvatarByEmail: jest.fn(),
    };
    userModel.findAvatarByEmail.mockResolvedValue([
      { filepath: 'avatar/e2bf468275' },
    ]);
    const userHelper = { deleteAvatarFile: jest.fn() };
    const userServiceInstance = new UserService(userModel, userHelper);

    it('<UserService.deleteAvatar> does not return', async () => {
      const res = await userServiceInstance.deleteAvatar('a@foo.com');
      expect(res).toBeUndefined();
    });

    it('<UserService.deleteAvatar> throw http error(unable to delete avatar)', async () => {
      userModel.deleteAvatarByEmail.mockRejectedValue(new Error('ERROR'));
      await expect(
        userServiceInstance.deleteAvatar('a@foo.com'),
      ).rejects.toThrow(createHttpError(400, 'unable to delete avatar'));
    });
  });
});

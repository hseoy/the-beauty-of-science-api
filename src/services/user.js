import createHttpError from 'http-errors';
import { Container, Service } from 'typedi';

@Service()
export default class UserService {
  #userHelper;

  #userModel;

  constructor(userModel, userHelper) {
    this.#userModel = userModel || Container.get('userHelper');
    this.#userHelper = userHelper || Container.get('userModel');
  }

  async findAllUserIds() {
    try {
      const users = await this.#userModel.findAll();
      const userIds = users.map(user => user.id);
      return userIds;
    } catch (e) {
      throw createHttpError(400, 'unable to find users');
    }
  }

  async findUser(id) {
    try {
      const [user] = await this.#userModel.findById(id);
      return user;
    } catch (e) {
      throw createHttpError(400, 'unable to find user');
    }
  }

  async updateUser(id, user) {
    try {
      const { username } = user;
      const [updatedUser] = await this.#userModel.updateUserWithId(id, {
        username,
      });
      return updatedUser;
    } catch (e) {
      throw createHttpError(400, 'unable to update user');
    }
  }

  async deleteUser(id) {
    try {
      await this.#userModel.deleteById(id);
    } catch (e) {
      throw createHttpError(400, 'unable to delete user');
    }
  }

  async getAvatarFileByEmail(email) {
    try {
      const [avatar] = await this.#userModel.findAvatarByEmail(email);
      const avatarFilePath = this.#userHelper.getAvatarFilePath(
        avatar.filepath,
      );
      return { mimetype: avatar.mimetype, path: avatarFilePath };
    } catch (e) {
      throw createHttpError(400, 'unable to get avatar image');
    }
  }

  async getAvatarFileById(id) {
    try {
      const user = await this.findUser(id);
      return this.getAvatarFileByEmail(user.email);
    } catch (e) {
      throw createHttpError(400, 'unable to get avatar image');
    }
  }

  async updateAvatar(file, email) {
    try {
      const { filename, mimetype, size, path } = file;
      await this.deleteBeforeAvatar(email);
      await this.#userModel.updateAvatar(email, filename, path, mimetype, size);
    } catch (e) {
      throw createHttpError(400, 'unable to update avatar');
    }
  }

  async deleteAvatar(email) {
    try {
      await this.deleteBeforeAvatar(email);
      await this.#userModel.deleteAvatarByEmail(email);
    } catch (e) {
      throw createHttpError(400, 'unable to delete avatar');
    }
  }

  async deleteBeforeAvatar(email) {
    try {
      const [beforeAvatar] = await this.#userModel.findAvatarByEmail(email);
      if (beforeAvatar) {
        await this.#userHelper.deleteAvatarFile(beforeAvatar.filepath);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}

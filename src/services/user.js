import createHttpError from 'http-errors';
import { Service, Inject } from 'typedi';

@Service()
export default class UserService {
  @Inject('userHelper')
  userHelper;

  @Inject('userModel')
  userModel;

  @Inject('userAvatarModel')
  userAvatarModel;

  @Inject('postModel')
  postModel;

  @Inject('postScoreModel')
  postScoreModel;

  constructor({
    userHelper,
    userModel,
    userAvatarModel,
    postModel,
    postScoreModel,
  } = {}) {
    this.userModel = userModel;
    this.userHelper = userHelper;
    this.userAvatarModel = userAvatarModel;
    this.postModel = postModel;
    this.postScoreModel = postScoreModel;
  }

  async findAllUserIds() {
    try {
      const users = await this.userModel.findAll();
      const userIds = users.map(user => user.id);
      return userIds;
    } catch (e) {
      throw createHttpError(400, 'unable to find users');
    }
  }

  async findUser(id) {
    try {
      const [user] = await this.userModel.findBy({ id });
      return user;
    } catch (e) {
      throw createHttpError(400, 'unable to find user');
    }
  }

  async updateUser(id, user) {
    try {
      const { username } = user;
      const [updatedUser] = await this.userModel.updateWith(
        { id },
        { username },
      );
      return updatedUser;
    } catch (e) {
      throw createHttpError(400, 'unable to update user');
    }
  }

  async deleteUser(id) {
    const trx = await this.userModel.transaction();
    try {
      await this.userModel.transactionStartWithTrx(trx);
      await this.userAvatarModel.transactionStartWithTrx(trx);
      await this.postModel.transactionStartWithTrx(trx);
      await this.postScoreModel.transactionStartWithTrx(trx);

      const [avatar] = await this.userAvatarModel.findBy({ userid: id });

      await this.userModel.deleteBy({ id });
      await this.userAvatarModel.deleteBy({ userid: id });
      await this.postModel.deleteBy({ authorid: id });
      await this.postScoreModel.deleteBy({ evaluatorid: id });

      await this.userHelper.deleteAvatarFile(avatar.filepath);

      await this.userModel.transactionCommit();
    } catch (e) {
      await this.userModel.transactionRollback();
      throw createHttpError(400, 'unable to delete user');
    }
  }

  async getAvatarFile(userid) {
    try {
      const [avatar] = await this.userAvatarModel.findBy({ userid });
      const avatarFilePath = this.userHelper.getAvatarFilePath(avatar.filepath);
      return { mimetype: avatar.mimetype, path: avatarFilePath };
    } catch (e) {
      throw createHttpError(400, 'unable to get avatar image');
    }
  }

  async updateAvatar(file, userid) {
    try {
      const { filename, mimetype, size, path } = file;
      const [avatar] = await this.userAvatarModel.findBy({ userid });
      const updatedAvatar = await this.userAvatarModel.updateWith({
        userid,
        filename,
        path,
        mimetype,
        size,
      });
      await this.userHelper.deleteAvatarFile(avatar.filepath);
      return updatedAvatar;
    } catch (e) {
      throw createHttpError(400, 'unable to update avatar');
    }
  }

  async deleteAvatar(userid) {
    try {
      const [avatar] = await this.userAvatarModel.findBy({ userid });
      await this.userAvatarModel.deleteBy({ userid });
      await this.userHelper.deleteAvatarFile(avatar.filepath);
    } catch (e) {
      throw createHttpError(400, 'unable to delete avatar');
    }
  }
}

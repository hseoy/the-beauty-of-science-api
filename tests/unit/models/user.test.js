import UserModel from '@/models/user';
import connect from '@/loaders/postgres';

describe('User model unit tests', () => {
  let db;
  let userModel;

  const userName = 'Bruno';
  const userEmail = 'bruno@foo.com';
  const userPw = 'pwforbruno';
  const avatarFileName = 'e2bf468275';
  const avatarFilePath = 'avatar/e2bf468275';
  const avatarMimeType = 'image/jpeg';
  const avatarSize = '100';

  beforeAll(async () => {
    db = connect();
    userModel = new UserModel(db);
  });

  afterAll(() => {
    db.destroy();
  });

  beforeEach(async () => {
    await userModel.transactionStart();
  });

  afterEach(async () => {
    await userModel.transactionRollback();
  });

  describe('UserModel.create methods test', () => {
    it('<UserModel.createUser> returns created user object', async () => {
      const [createdUser] = await userModel.createUser(userEmail, userName);
      expect(createdUser).toMatchObject({
        email: userEmail,
        username: userName,
      });
    });

    it('<UserModel.createUserLogin> returns created login object', async () => {
      const [login] = await userModel.createUserLogin(userEmail, userPw);
      expect(login).toMatchObject({ email: userEmail, password: userPw });
    });

    it('<UserModel.createAvatar> returns avatar object', async () => {
      const [avatar] = await userModel.createAvatar(
        userEmail,
        avatarFileName,
        avatarFilePath,
        avatarMimeType,
        avatarSize,
      );
      expect(avatar).toMatchObject({
        email: userEmail,
        filename: avatarFileName,
        filepath: avatarFilePath,
        mimetype: avatarMimeType,
        size: avatarSize,
      });
    });
  });

  describe('UserModel.delete methods test', () => {
    let createdUser;

    beforeEach(async () => {
      [createdUser] = await userModel.createUser(userEmail, userName);
    });

    it('<UserModel.deleteByEmail> returns 1', async () => {
      const res = await userModel.deleteByEmail(createdUser.email);
      expect(res).toBe(1);
    });

    it('<UserModel.deleteById> returns 1', async () => {
      const res = await userModel.deleteById(createdUser.id);
      expect(res).toBe(1);
    });

    it('<UserModel.deleteAvatarByEmail> returns 1', async () => {
      const [createdAvatar] = await userModel.createAvatar(
        userEmail,
        avatarFileName,
        avatarFilePath,
        avatarMimeType,
        avatarSize,
      );
      const res = await userModel.deleteAvatarByEmail(createdAvatar.email);
      expect(res).toBe(1);
    });

    it('<UserModel.deleteLoginByEmail> returns 1', async () => {
      const [createdLogin] = await userModel.createUserLogin(userEmail, userPw);
      const res = await userModel.deleteLoginByEmail(createdLogin.email);
      expect(res).toBe(1);
    });
  });

  describe('UserModel.find methods test', () => {
    const createdUsers = [];
    let createdAvatar;
    let createdLogin;

    beforeAll(async () => {
      const users = [
        { email: 'a@gmail.com', username: 'a' },
        { email: 'b@gmail.com', username: 'b' },
        { email: 'c@gmail.com', username: 'a' },
      ];
      users.forEach(async user => {
        const [createdUser] = await userModel.createUser(
          user.email,
          user.username,
        );
        createdUsers.push(createdUser);
      });

      [createdAvatar] = await userModel.createAvatar(
        userEmail,
        avatarFileName,
        avatarFilePath,
        avatarMimeType,
        avatarSize,
      );

      [createdLogin] = await userModel.createUserLogin(userEmail, userPw);
    });

    afterAll(async () => {
      createdUsers.forEach(async user => {
        await userModel.deleteByEmail(user.email);
      });
      await userModel.deleteAvatarByEmail(createdAvatar.email);
      await userModel.deleteLoginByEmail(createdLogin.email);
    });

    it('<UserModel.findAll> returns user object array', async () => {
      const users = await userModel.findAll();
      expect(users.length).toBe(3);
      users.forEach((user, i) => {
        expect(user).toMatchObject(createdUsers[i]);
      });
    });

    it('<UserModel.findByUsername> returns user object', async () => {
      const users = await userModel.findByUsername(createdUsers[0].username);
      const sameNameUsers = createdUsers.filter(
        user => user.username === createdUsers[0].username,
      );
      expect(sameNameUsers.length).toBe(2);
      expect(users[0]).toMatchObject(sameNameUsers[0]);
      expect(users[1]).toMatchObject(sameNameUsers[1]);
    });

    it('<UserModel.findById> returns user object', async () => {
      const [user] = await userModel.findById(createdUsers[0].id);
      expect(user).toMatchObject(createdUsers[0]);
    });

    it('<UserModel.findByEmail> returns user object', async () => {
      const [user] = await userModel.findByEmail(createdUsers[0].email);
      expect(user).toMatchObject(createdUsers[0]);
    });

    it('<UserModel.findPasswordByEmail> returns password', async () => {
      const [login] = await userModel.findPasswordByEmail(createdLogin.email);
      expect(login.password).toBe(createdLogin.password);
    });

    it('<UserModel.findAvatarEmail> returns avatar object', async () => {
      const [avatar] = await userModel.findAvatarByEmail(createdAvatar.email);
      expect(avatar).toMatchObject(createdAvatar);
    });
  });

  describe('UserModel.update methods test', () => {
    let createdUser;

    beforeAll(async () => {
      [createdUser] = await userModel.createUser(userEmail, userName);
    });

    afterAll(async () => {
      await userModel.deleteByEmail(createdUser.email);
    });

    it('<UserModel.updateUserWithId> returns updated user object', async () => {
      const user = { username: 'a' };
      const [updatedUser] = await userModel.updateUserWithId(
        createdUser.id,
        user,
      );
      expect(updatedUser).toMatchObject(user);
    });

    it('<UserModel.updateUsernameWithId> returns updated user object', async () => {
      const username = 'b';
      const [updatedUser] = await userModel.updateUsernameWithId(
        createdUser.id,
        username,
      );
      expect(updatedUser.username).toBe(username);
    });

    it('<UserModel.updateExperienceWithId> returns updated user object', async () => {
      const experience = parseInt(createdUser.experience, 10) + 1;
      const [updatedUser] = await userModel.updateExperienceWithId(
        createdUser.id,
        experience,
      );
      expect(updatedUser.experience).toBe(experience.toString());
    });

    it('<UserModel.updatePostcntWithId> returns updated user object', async () => {
      const postcnt = parseInt(createdUser.postcnt, 10) + 1;
      const [updatedUser] = await userModel.updatePostcntWithId(
        createdUser.id,
        postcnt,
      );
      expect(updatedUser.postcnt).toBe(postcnt.toString());
    });

    it('<UserModel.updateQuizcntWithId> returns updated user object', async () => {
      const quizcnt = parseInt(createdUser.quizcnt, 10) + 1;
      const [updatedUser] = await userModel.updateQuizcntWithId(
        createdUser.id,
        quizcnt,
      );
      expect(updatedUser.quizcnt).toBe(quizcnt.toString());
    });

    it('<UserModel.updateAvatar> returns updated avatar object', async () => {
      const [updatedAvatar] = await userModel.updateAvatar(
        createdUser.email,
        `${avatarFileName}_UPDATED`,
        `${avatarFilePath}_UPDATED`,
        `${avatarMimeType}_UPDATED`,
        avatarSize,
      );

      expect(updatedAvatar).toMatchObject({
        filename: `${avatarFileName}_UPDATED`,
        filepath: `${avatarFilePath}_UPDATED`,
        mimetype: `${avatarMimeType}_UPDATED`,
        size: avatarSize,
      });
    });
  });
});

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
      console.log(createdLogin, login);
      expect(login.password).toBe(createdLogin.password);
    });

    it('<UserModel.findAvatarEmail> returns avatar object', async () => {
      const [avatar] = await userModel.findAvatarByEmail(createdAvatar.email);
      expect(avatar).toMatchObject(createdAvatar);
    });
  });
});

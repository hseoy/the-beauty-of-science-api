import UserModel from '@/models/user';
import connect from '@/loaders/postgres';

describe('User model unit tests', () => {
  let db;
  let userModel;

  const mockUser = {
    username: 'Bruno',
    email: 'bruno@foo.com',
  };

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
      const [createdUser] = await userModel.create(mockUser);
      expect(createdUser).toMatchObject(mockUser);
    });
  });
});

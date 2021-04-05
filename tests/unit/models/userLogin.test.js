import UserLoginModel from '@/models/userLogin';
import connect from '@/loaders/postgres';

describe('UserLoginModel model unit tests', () => {
  let db;
  let userLoginModel;

  beforeAll(() => {
    db = connect();
    userLoginModel = new UserLoginModel(db);
  });

  afterAll(() => {
    db.destroy();
  });

  beforeEach(async () => {
    await userLoginModel.transactionStart();
  });

  afterEach(async () => {
    await userLoginModel.transactionRollback();
  });

  it('UserLoginModel properties test', () => {
    expect(userLoginModel.id).toBe('id');
    expect(userLoginModel.userid).toBe('userid');
    expect(userLoginModel.password).toBe('password');
  });
});

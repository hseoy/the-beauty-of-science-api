import UserAvatarModel from '@/models/userAvatar';
import connect from '@/loaders/postgres';

describe('UserAvatarModel model unit tests', () => {
  let db;
  let userAvatarModel;

  const mockAvatar = {
    userid: 1,
    filename: 'test',
    filepath: 'avatar/test',
    mimetype: 'image/jpeg',
    size: '100',
  };

  beforeAll(() => {
    db = connect();
    userAvatarModel = new UserAvatarModel(db);
  });

  afterAll(() => {
    db.destroy();
  });

  beforeEach(async () => {
    await userAvatarModel.transactionStart();
  });

  afterEach(async () => {
    await userAvatarModel.transactionRollback();
  });

  it('PostCommentModel properties test', () => {
    expect(userAvatarModel.id).toBe('id');
    expect(userAvatarModel.userid).toBe('userid');
    expect(userAvatarModel.filename).toBe('filename');
    expect(userAvatarModel.filepath).toBe('filepath');
    expect(userAvatarModel.mimetype).toBe('mimetype');
    expect(userAvatarModel.size).toBe('size');
  });

  describe('UserModel.create methods test', () => {
    it('<UserModel.createUser> returns created user object', async () => {
      const [createdAvatar] = await userAvatarModel.create(mockAvatar);
      expect(createdAvatar).toMatchObject(mockAvatar);
    });
  });

  describe('UserModel.updateWith methods test', () => {
    it('<UserModel.updateWith> returns updated user object', async () => {
      const updatedMockAvatar = {
        ...mockAvatar,
        filename: '123',
        filepath: 'avatar/123',
      };
      await userAvatarModel.create(mockAvatar);
      const [updatedAvatar] = await userAvatarModel.updateWith(
        updatedMockAvatar,
      );
      expect(updatedAvatar).toMatchObject(updatedMockAvatar);
    });
  });
});

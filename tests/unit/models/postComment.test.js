import PostCommentModel from '@/models/postComment';
import connect from '@/loaders/postgres';

describe('PostComment model unit tests', () => {
  let db;
  let postCommentModel;

  beforeAll(() => {
    db = connect();
    postCommentModel = new PostCommentModel(db);
  });

  afterAll(() => {
    db.destroy();
  });

  beforeEach(async () => {
    await postCommentModel.transactionStart();
  });

  afterEach(async () => {
    await postCommentModel.transactionRollback();
  });

  it('PostCommentModel properties test', () => {
    expect(postCommentModel.id).toBe('id');
    expect(postCommentModel.postid).toBe('postid');
    expect(postCommentModel.parentid).toBe('parentid');
    expect(postCommentModel.authorid).toBe('authorid');
    expect(postCommentModel.content).toBe('content');
    expect(postCommentModel.created).toBe('created');
    expect(postCommentModel.modified).toBe('modified');
  });
});

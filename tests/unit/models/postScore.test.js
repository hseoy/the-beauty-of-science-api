import PostScoreModel from '@/models/postScore';
import connect from '@/loaders/postgres';

describe('Post score model unit tests', () => {
  let db;
  let postScoreModel;

  const mockPostScore = {
    postid: 1,
    score: 5,
    evaluatorid: 1,
  };

  beforeAll(() => {
    db = connect();
    postScoreModel = new PostScoreModel(db);
  });

  afterAll(() => {
    db.destroy();
  });

  beforeEach(async () => {
    await postScoreModel.transactionStart();
  });

  afterEach(async () => {
    await postScoreModel.transactionRollback();
  });

  describe('PostScoreModel.update methods test', () => {
    let createdPostScore;

    beforeEach(async () => {
      [createdPostScore] = await postScoreModel.create(mockPostScore);
    });

    it('<PostScoreModel.updateWith({id}> returns updated post object', async () => {
      const [updatedPostScore] = await postScoreModel.updateWith(
        { id: createdPostScore.id },
        createdPostScore.score - 1,
      );
      expect(updatedPostScore.score).toBe(createdPostScore.score - 1);
    });

    it('<PostScoreModel.updateWith({evaluator}> returns updated post object', async () => {
      const [updatedPostScore] = await postScoreModel.updateWith(
        { evaluatorid: createdPostScore.evaluatorid },
        createdPostScore.score - 1,
      );
      expect(updatedPostScore.score).toBe(createdPostScore.score - 1);
    });
  });
});

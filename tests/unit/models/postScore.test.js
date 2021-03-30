import PostScoreModel from '@/models/postScore';
import connect from '@/loaders/postgres';

describe('Post score model unit tests', () => {
  let db;
  let postScoreModel;

  const mockPostScore = {
    postid: 1,
    score: 5,
    evaluator: 'bruno@foo.com',
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

  describe('PostScoreModel.create methods test', () => {
    it('<PostModel.create> returns created post score object', async () => {
      const [createdPostScore] = await postScoreModel.create(mockPostScore);
      expect(createdPostScore).toMatchObject(mockPostScore);
    });
  });

  describe('PostScoreModel.delete methods test', () => {
    let createdPostScore;

    beforeEach(async () => {
      [createdPostScore] = await postScoreModel.create(mockPostScore);
    });

    it('<PostScoreModel.deleteBy({id})> returns 1', async () => {
      const res = await postScoreModel.deleteBy({ id: createdPostScore.id });
      expect(res).toBe(1);
    });

    it('<PostScoreModel.deleteBy({evaluator})> returns 1', async () => {
      const res = await postScoreModel.deleteBy({
        evaluator: createdPostScore.evaluator,
      });
      expect(res).toBe(1);
    });
  });

  describe('PostScoreModel.update methods test', () => {
    let createdPostScore;

    beforeEach(async () => {
      [createdPostScore] = await postScoreModel.create(mockPostScore);
    });

    it('<PostScoreModel.updateWith({id}> returns updated post object', async () => {
      const [updatedPostScore] = await postScoreModel.updateScoreWith(
        { id: createdPostScore.id },
        createdPostScore.score - 1,
      );
      expect(updatedPostScore.score).toBe(createdPostScore.score - 1);
    });

    it('<PostScoreModel.updateWith({evaluator}> returns updated post object', async () => {
      const [updatedPostScore] = await postScoreModel.updateScoreWith(
        { evaluator: createdPostScore.evaluator },
        createdPostScore.score - 1,
      );
      expect(updatedPostScore.score).toBe(createdPostScore.score - 1);
    });
  });

  describe('PostScoreModel.find methods test', () => {
    const createdPostScoreList = [];

    beforeAll(async () => {
      const postScoreList = [
        { postid: 1, score: 1, evaluator: 'a@foo.com' },
        { postid: 1, score: 5, evaluator: 'b@foo.com' },
        { postid: 1, score: 3, evaluator: 'c@foo.com' },
        { postid: 2, score: 1, evaluator: 'a@foo.com' },
      ];
      postScoreList.forEach(async postScore => {
        const [createdPostScore] = await postScoreModel.create(postScore);
        createdPostScoreList.push(createdPostScore);
      });
    });

    afterAll(async () => {
      createdPostScoreList.forEach(async postScore => {
        await postScoreModel.deleteBy({ id: postScore.id });
      });
    });

    it('<PostScoreModel.findAll> returns post score object array', async () => {
      const postScoreList = await postScoreModel.findAll();
      postScoreList.forEach((postScore, i) => {
        expect(postScore).toMatchObject(createdPostScoreList[i]);
      });
    });

    it('<PostScoreModel.findByPostId> returns post score object', async () => {
      const [postScore] = await postScoreModel.findByPostId(
        createdPostScoreList[3].postid,
      );
      expect(postScore).toMatchObject(createdPostScoreList[3]);
    });

    it('<PostScoreModel.findByEvaluator> returns post score object', async () => {
      const [postScore] = await postScoreModel.findByEvaluator(
        createdPostScoreList[0].evaluator,
      );
      expect(postScore).toMatchObject(createdPostScoreList[0]);
    });
  });
});

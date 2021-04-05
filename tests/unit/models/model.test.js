import Model from '@/models/model';
import connect from '@/loaders/postgres';

describe('Model unit tests', () => {
  let db;
  let model;

  const mockTable = 'posts_score';
  const mockData = {
    postid: 1,
    score: 5,
    evaluatorid: 1,
  };
  const mockDataList = [
    { postid: 1, score: 5, evaluatorid: 1 },
    { postid: 2, score: 4, evaluatorid: 2 },
    { postid: 3, score: 3, evaluatorid: 3 },
    { postid: 1, score: 3, evaluatorid: 2 },
  ];

  beforeAll(async () => {
    db = connect();
    model = new Model(db);
    model.table = mockTable;
  });

  afterAll(() => {
    db.destroy();
  });

  describe('Model.transaction methods test', () => {
    it('<Model.transactionStartWithTrx> sets trx property', async () => {
      const trx = await model.transaction();
      await model.transactionStartWithTrx(trx);
      expect(model.trx).toEqual(trx);
      await model.transactionRollback();
    });

    it('<Model.transactionCommit> does nothing if trx is equal to db', async () => {
      const res = await model.transactionCommit();
      expect(res).toBeUndefined();
    });

    it('<Model.transactionRollback> does nothing if trx is equal to db', async () => {
      const res = await model.transactionRollback();
      expect(res).toBeUndefined();
    });

    it('<Model.transactionCommit> commit if transaction is completed', async () => {
      await model.transactionStart();
      await model.transactionCommit();
    });
  });

  describe('Model CRUD methods test', () => {
    beforeEach(async () => {
      await model.transactionStart();
    });

    afterEach(async () => {
      await model.transactionRollback();
    });

    it('Model CRUD methods return null if table is Falsy', async () => {
      let res;
      model.table = '';

      res = await model.create();
      expect(res).toBeNull();

      res = await model.deleteBy();
      expect(res).toBeNull();

      res = await model.updateWith();
      expect(res).toBeNull();

      res = await model.findAll();
      expect(res).toBeNull();

      res = await model.findBy();
      expect(res).toBeNull();

      res = await model.findByOrderBy();
      expect(res).toBeNull();

      model.table = mockTable;
    });

    it('<Model.create> returns created object', async () => {
      const [res] = await model.create(mockData);
      expect(res).toMatchObject(mockData);
    });

    it('<Model.deleteBy> returns 1', async () => {
      const [createdData] = await model.create(mockData);
      const res = await model.deleteBy({ id: createdData.id });
      expect(res).toBe(1);
    });

    it('<Model.updateWith> returns updated object', async () => {
      const [createdData] = await model.create(mockData);
      const [updatedData] = await model.updateWith(
        { id: createdData.id },
        { score: 0 },
      );
      expect(updatedData.score).toBe(0);
    });

    describe('Model find methods test', () => {
      const createdDataList = [];

      beforeAll(async () => {
        mockDataList.forEach(async data => {
          const [createdData] = await model.create(data);
          createdDataList.push(createdData);
        });
      });

      it('<Model.findBy> returns data object', async () => {
        const [data] = await model.findBy({ id: createdDataList[0].id });
        expect(data).toMatchObject(createdDataList[0]);
      });

      it('<Model.findByOrderBy> returns data list', async () => {
        const foundDataList = await model.findByOrderBy(
          { postid: mockDataList[0].postid },
          'score',
          true,
        );
        expect(foundDataList.length).toBe(2);
        expect(foundDataList[0]).toMatchObject(createdDataList[0]);
        expect(foundDataList[1]).toMatchObject(createdDataList[3]);
      });

      it('<Model.findByOrderBy({offset, limit})> returns data list', async () => {
        const foundDataList = await model.findByOrderBy({}, 'postid', false, {
          offset: 2,
          limit: 2,
        });
        expect(foundDataList.length).toBe(2);
        expect(foundDataList[0]).toMatchObject(createdDataList[1]);
        expect(foundDataList[1]).toMatchObject(createdDataList[2]);
      });
    });
  });
});

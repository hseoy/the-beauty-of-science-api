import Container from 'typedi';

export default class Model {
  #db;

  trx;

  #trxProvider;

  table;

  constructor(db) {
    this.#db = db || Container.get('db');
    this.trx = this.#db;
    this.#trxProvider = this.#db.transactionProvider();
    this.table = '';
  }

  async transaction() {
    this.#trxProvider = this.#db.transactionProvider();
    return this.#trxProvider();
  }

  async transactionStart() {
    this.trx = await this.transaction();
  }

  async transactionStartWithTrx(trx) {
    this.trx = trx;
  }

  async transactionCommit() {
    if (this.trx === this.#db) {
      return;
    }
    if (this.trx.isCompleted() === false) {
      await this.trx.commit();
      this.trx = this.#db;
    }
  }

  async transactionRollback() {
    if (this.trx === this.#db) {
      return;
    }
    if (this.trx.isCompleted() === false) {
      await this.trx.rollback();
      this.trx = this.#db;
    }
  }

  create(columns) {
    if (this.table) {
      return this.trx(this.table).returning('*').insert(columns);
    }
    return null;
  }

  deleteBy(columns) {
    if (this.table) {
      return this.trx(this.table).where(columns).del();
    }
    return null;
  }

  updateWith(columns, update) {
    if (this.table) {
      return this.trx(this.table).where(columns).update(update).returning('*');
    }
    return null;
  }

  findAll() {
    if (this.table) {
      return this.trx(this.table).select('*');
    }
    return null;
  }

  findBy(columns) {
    return this.findAll().where(columns);
  }

  findByOrderBy(columns, orderBy, isDesc) {
    const order = isDesc ? 'desc' : 'asc';
    return this.findBy(columns).orderBy(orderBy, order);
  }
}

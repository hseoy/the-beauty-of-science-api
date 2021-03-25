import Container from 'typedi';

export default class Model {
  #db;

  trx;

  #trxProvider;

  constructor(db) {
    this.#db = db || Container.get('db');
    this.trx = this.#db;
    this.#trxProvider = this.#db.transactionProvider();
  }

  get transaction() {
    return this.#trxProvider();
  }

  async transactionStart() {
    this.#trxProvider = this.#db.transactionProvider();
    this.trx = await this.#trxProvider();
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
}

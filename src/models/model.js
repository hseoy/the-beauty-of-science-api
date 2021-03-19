import Container from 'typedi';

export default class Model {
  #db = Container.get('db');

  trx = this.#db;

  #trxProvider = this.#db.transactionProvider();

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
    if (this.trx.isCompleted() === false) {
      await this.trx.commit();
      this.trx = this.#db;
    }
  }

  async transactionRollback() {
    if (this.trx.isCompleted() === false) {
      await this.trx.rollback();
      this.trx = this.#db;
    }
  }
}

import Model from './model';

export default class PostModel extends Model {
  create({ author, category, title, content }) {
    const now = this.trx.fn.now();
    return this.trx('posts').returning('*').insert({
      author,
      category,
      title,
      content,
      created: now,
      modified: now,
    });
  }

  deleteBy(columns) {
    return this.trx('posts').where(columns).del();
  }

  updateWith(columnsFindBy, post) {
    return this.trx('posts')
      .where(columnsFindBy)
      .update({ ...post, modified: this.trx.fn.now() })
      .returning('*');
  }

  findAll() {
    return this.trx('posts').select('*');
  }

  findBy(columns) {
    return this.findAll().where(columns);
  }

  findByOrderBy(columnsFindBy, columnOrderBy, desc) {
    const order = desc ? 'desc' : 'asc';
    return this.findBy(columnsFindBy).orderBy(columnOrderBy, order);
  }

  findByOrderByCreated(columnsFindBy, desc) {
    return this.findByOrderBy(columnsFindBy, 'created', desc);
  }

  findByOrderByModified(columnsFindBy, desc) {
    return this.findByOrderBy(columnsFindBy, 'modified', desc);
  }
}

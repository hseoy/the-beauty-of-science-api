import Model from './model';

export default class PostModel extends Model {
  table = 'posts';

  id = 'id';

  author = 'author';

  category = 'category';

  title = 'title';

  content = 'content';

  created = 'created';

  modified = 'modified';

  create(columns) {
    const now = this.trx.fn.now();
    return super.create({ ...columns, created: now, modified: now });
  }

  updateWith(columns, update) {
    return super.updateWith(columns, {
      ...update,
      modified: this.trx.fn.now(),
    });
  }

  findByOrderByCreated(columns, desc) {
    return this.findByOrderBy(columns, 'created', desc);
  }

  findByOrderByModified(columns, desc) {
    return this.findByOrderBy(columns, 'modified', desc);
  }
}

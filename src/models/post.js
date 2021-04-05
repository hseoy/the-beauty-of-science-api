import Model from './model';

export default class PostModel extends Model {
  table = 'posts';

  id = 'id';

  authorid = 'authorid';

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

  findByOrderByCreated(columns, desc, { offset, limit } = {}) {
    return this.findByOrderBy(columns, this.created, desc, { offset, limit });
  }

  findByOrderByModified(columns, desc, { offset, limit } = {}) {
    return this.findByOrderBy(columns, this.modified, desc, { offset, limit });
  }
}

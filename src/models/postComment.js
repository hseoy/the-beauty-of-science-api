import Model from './model';

export default class PostCommentModel extends Model {
  table = 'posts_comments';

  id = 'id';

  postid = 'postid';

  parentid = 'parentid';

  authorid = 'authorid';

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
}

import Model from './model';

export default class PostCommentModel extends Model {
  table = 'posts_comments';

  id = 'id';

  postid = 'postid';

  parentid = 'parentid';

  author = 'author';

  content = 'content';

  created = 'created';

  modified = 'modified';
}

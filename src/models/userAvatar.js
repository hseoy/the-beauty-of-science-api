import Model from './model';

export default class UserAvatarModel extends Model {
  table = 'users_avatar';

  id = 'id';

  userid = 'userid';

  filename = 'filename';

  filepath = 'filepath';

  mimetype = 'mimetype';

  size = 'size';

  create(columns) {
    return super.create(columns).onConflict(this.userid).merge();
  }

  updateWith(update) {
    return this.create(update);
  }
}

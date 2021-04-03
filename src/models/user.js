import Model from './model';

export default class UserModel extends Model {
  table = 'users';

  id = 'id';

  username = 'username';

  email = 'email';

  experience = 'experience';

  postcnt = 'postcnt';

  quizcnt = 'quizcnt';

  joined = 'joined';

  create(columns) {
    return super.create({ ...columns, joined: this.trx.fn.now() });
  }
}

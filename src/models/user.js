import Model from './model';

export default class UserModel extends Model {
  createUser(email, username) {
    return this.trx('users')
      .returning('*')
      .insert({ email, username, joined: new Date() });
  }

  createUserLogin(email, password) {
    return this.trx('users_login').returning('*').insert({ email, password });
  }

  createAvatar(email, filename, filepath, mimetype, size) {
    return this.trx('users_avatar')
      .returning('*')
      .insert({ email, filename, filepath, mimetype, size });
  }

  deleteByEmail(email) {
    return this.trx('users').where({ email }).del();
  }

  deleteById(id) {
    return this.trx('users').where({ id }).del();
  }

  findAll() {
    return this.trx('users').select('*');
  }

  fileByUsername(username) {
    return this.findAll().where({ username });
  }

  findById(id) {
    return this.findAll().where({ id });
  }

  findByEmail(email) {
    return this.findAll().where({ email });
  }

  findPasswordByEmail(email) {
    return this.trx('users_login').select('password').where({ email });
  }

  updateUsernameWithId(id, username) {
    return this.trx('users').where({ id }).update({ username }).returning('*');
  }

  updateExperienceWithId(id, experience) {
    return this.trx('users')
      .where({ id })
      .update({ experience })
      .returning('*');
  }

  updatePostcntWithId(id, postcnt) {
    return this.trx('users').where({ id }).update({ postcnt }).returning('*');
  }

  updateQuizcntWithId(id, quizcnt) {
    return this.trx('users').where({ id }).update({ quizcnt }).returning('*');
  }
}
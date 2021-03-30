import Model from './model';

export default class PostScoreModel extends Model {
  create({ postid, score, evaluator }) {
    return this.trx('posts_score')
      .returning('*')
      .insert({ postid, score, evaluator });
  }

  deleteBy(columns) {
    return this.trx('posts_score').where(columns).del();
  }

  updateScoreWith(columnsFindBy, score) {
    return this.trx('posts_score')
      .where(columnsFindBy)
      .update({ score })
      .returning('*');
  }

  findAll() {
    return this.trx('posts_score').select('*');
  }

  findByPostId(postid) {
    return this.findAll().where({ postid });
  }

  findByEvaluator(evaluator) {
    return this.findAll().where({ evaluator });
  }
}

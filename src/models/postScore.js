import Model from './model';

export default class PostScoreModel extends Model {
  table = 'posts_score';

  id = 'id';

  postid = 'postid';

  score = 'score';

  evaluator = 'evaluator';

  updateWith(columns, update) {
    return super.updateWith(columns, { score: update });
  }
}

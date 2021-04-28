import createHttpError from 'http-errors';
import { Service, Inject } from 'typedi';

@Service()
export default class PostService {
  @Inject('postScoreModel')
  postScoreModel;

  constructor({ postScoreModel } = {}) {
    this.postScoreModel = postScoreModel;
  }

  async findPostScore(postid, userid) {
    const evaluatorid = userid;
    try {
      const selector = evaluatorid ? { postid, evaluatorid } : { postid };
      const scoreList = await this.postScoreModel.findBy(selector);
      if (userid) {
        return scoreList[0];
      }
      return scoreList;
    } catch (e) {
      console.log(e);
      throw createHttpError(400, 'unable to find score');
    }
  }

  async createPostScore(postid, userid, score) {
    try {
      const [createdScore] = await this.postScoreModel.create({
        evaluatorid: userid,
        postid,
        score,
      });
      return createdScore;
    } catch (e) {
      throw createHttpError(400, 'unable to create score');
    }
  }

  async updatePostScore(postid, userid, score) {
    try {
      const [updatedScore] = await this.postScoreModel.updateWith(
        { postid, evaluatorid: userid },
        score,
      );
      return updatedScore;
    } catch (e) {
      throw createHttpError(400, 'unable to update score');
    }
  }

  async deletePostScore(postid, userid) {
    try {
      await this.postScoreModel.deleteBy({ postid, evaluatorid: userid });
    } catch (e) {
      throw createHttpError(400, 'unable to delete score');
    }
  }
}

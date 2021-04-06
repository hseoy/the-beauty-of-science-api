import createHttpError from 'http-errors';
import { Service, Inject } from 'typedi';

@Service()
export default class PostService {
  @Inject('userModel')
  userModel;

  @Inject('postModel')
  postModel;

  @Inject('postScoreModel')
  postScoreModel;

  @Inject('postCommentModel')
  postCommentModel;

  constructor({ userModel, postModel, postScoreModel, postCommentModel } = {}) {
    this.userModel = userModel;
    this.postModel = postModel;
    this.postScoreModel = postScoreModel;
    this.postCommentModel = postCommentModel;
  }

  async findPostIds(category, { offset, limit } = {}) {
    try {
      const posts = await this.postModel.findByOrderByCreated(category, false, {
        offset,
        limit,
      });
      const postIds = posts.map(post => post.id);
      return postIds;
    } catch (e) {
      throw createHttpError(400, 'unable to find posts');
    }
  }

  async findPost(id) {
    try {
      const [post] = await this.postModel.findBy({ id });
      const [author] = await this.userModel.findBy({ id: post.authorid });
      const scoreList = await this.postScoreModel.findBy({ postid: id });
      const total = scoreList.reduce((acc, cur) => acc + cur, 0);
      const participantCnt = scoreList.length;
      const average = total / participantCnt;

      return {
        ...post,
        author: author.username,
        participantCnt,
        total,
        average,
      };
    } catch (e) {
      throw createHttpError(400, 'unable to find post');
    }
  }

  async updatePost(id, post) {
    try {
      const { title, content, category } = post;
      const [updatedPost] = await this.postModel.updateWith(
        { id },
        { title, content, category },
      );
      return updatedPost;
    } catch (e) {
      throw createHttpError(400, 'unable to update post');
    }
  }

  async deletePost(id) {
    const trx = await this.postModel.transaction();
    try {
      await this.postModel.transactionStartWithTrx(trx);
      await this.postScoreModel.transactionStartWithTrx(trx);
      await this.postCommentModel.transactionStartWithTrx(trx);

      await this.postModel.deleteBy({ id });
      await this.postScoreModel.deleteBy({ postid: id });
      await this.postCommentModel.deleteBy({ postid: id });

      await this.postModel.transactionCommit();
    } catch (e) {
      await this.postModel.transactionRollback();
      throw createHttpError(400, 'unable to delete post');
    }
  }
}

import createHttpError from 'http-errors';
import { Service, Inject } from 'typedi';

@Service()
export default class PostService {
  @Inject('postCommentModel')
  postCommentModel;

  constructor({ postCommentModel } = {}) {
    this.postCommentModel = postCommentModel;
  }

  async findPostCommentIds(postid, { offset, limit } = {}) {
    try {
      const comments = await this.postCommentModel.findByOrderBy(
        { postid },
        this.postCommentModel.created,
        false,
        { offset, limit },
      );
      const commentIds = comments.map(comment => comment.id);
      return commentIds;
    } catch (e) {
      throw createHttpError(400, 'unable to find comments');
    }
  }

  async findComment(id) {
    try {
      const [comment] = await this.postCommentModel.findBy({ id });
      return comment;
    } catch (e) {
      throw createHttpError(400, 'unable to find comment');
    }
  }

  async createComment(authorid, comment) {
    try {
      const { postid, parentid, content } = comment;
      const [createdComment] = await this.postCommentModel.create({
        authorid,
        postid,
        parentid,
        content,
      });
      return createdComment;
    } catch (e) {
      throw createHttpError(400, 'unable to create comment');
    }
  }

  async updateComment(id, comment) {
    try {
      const { parentid, content } = comment;
      const [updatedComment] = await this.postCommentModel.updateWith(
        { id },
        { parentid, content },
      );
      return updatedComment;
    } catch (e) {
      throw createHttpError(400, 'unable to update comment');
    }
  }

  async deleteComment(id) {
    await this.postCommentModel.transactionStart();
    try {
      await this.postCommentModel.deleteBy({ id });
      await this.postCommentModel.transactionCommit();
    } catch (e) {
      await this.postCommentModel.transactionRollback();
      throw createHttpError(400, 'unable to delete comment');
    }
  }
}

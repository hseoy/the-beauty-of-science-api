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

  async updateComment(authorid, id, comment) {
    if (!id) {
      throw createHttpError(400, 'invalid query parameters');
    }

    try {
      console.log(authorid, id, comment);
      const { parentid, content } = comment;
      const [updatedComment] = await this.postCommentModel.updateWith(
        { authorid, id },
        { parentid, content },
      );
      return updatedComment;
    } catch (e) {
      throw createHttpError(400, 'unable to update comment');
    }
  }

  async deleteComment(authorid, id) {
    try {
      const isDeleted = await this.postCommentModel.deleteBy({ authorid, id });
      if (isDeleted === 0) {
        throw new Error('not found post comment');
      }
    } catch (e) {
      throw createHttpError(400, 'unable to delete comment');
    }
  }
}

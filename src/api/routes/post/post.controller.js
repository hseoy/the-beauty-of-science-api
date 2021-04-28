import { Container } from 'typedi';
import PostService from '@/services/post';
import PostCommentService from '@/services/postComment';
import PostScoreService from '@/services/postScore';

const handleGetPostIds = async (req, res, next) => {
  try {
    const { category, offset, limit } = req.query;
    const postServiceInstance = Container.get(PostService);
    const postIds = await postServiceInstance.findPostIds(category, {
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
    });
    return res.status(200).json(postIds);
  } catch (e) {
    return next(e);
  }
};

const handleGetPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const postServiceInstance = Container.get(PostService);
    const post = await postServiceInstance.findPost(id);
    return res.status(200).json(post);
  } catch (e) {
    return next(e);
  }
};

const handleCreatePost = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    const postServiceInstance = Container.get(PostService);
    const createdPost = await postServiceInstance.createPost(
      req.currentUser.id,
      { title, content, category },
    );
    return res.status(200).json(createdPost);
  } catch (e) {
    return next(e);
  }
};

const handleUpdatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const postServiceInstance = Container.get(PostService);
    const updatedPost = await postServiceInstance.updatePost(
      req.currentUser.id,
      id,
      { title, content, category },
    );
    return res.status(200).json(updatedPost);
  } catch (e) {
    return next(e);
  }
};

const handleDeletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const postServiceInstance = Container.get(PostService);
    await postServiceInstance.deletePost(req.currentUser.id, id);
    return res.status(200).end();
  } catch (e) {
    return next(e);
  }
};

const handleGetPostCommentOrIds = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { commentid, offset, limit } = req.query;
    const postCommentServiceInstance = Container.get(PostCommentService);

    if (commentid) {
      const comment = postCommentServiceInstance.findComment(commentid);
      return res.status(200).json({ comment });
    }
    const postCommentIds = await postCommentServiceInstance.findPostCommentIds(
      id,
      { offset, limit },
    );
    return res.status(200).json({ comments: postCommentIds });
  } catch (e) {
    return next(e);
  }
};

const handleCreatePostComment = async (req, res, next) => {
  try {
    const { comment } = req.body;
    const postCommentServiceInstance = Container.get(PostCommentService);
    const createdComment = await postCommentServiceInstance.createComment(
      req.currentUser.id,
      comment,
    );
    return res.status(200).json({ comment: createdComment });
  } catch (e) {
    return next(e);
  }
};

const handleUpdatePostComment = async (req, res, next) => {
  try {
    const { commentid } = req.query;
    const { comment } = req.body;
    const postCommentServiceInstance = Container.get(PostCommentService);
    const updatedComment = await postCommentServiceInstance.updaateComment(
      req.currentUser.id,
      commentid,
      comment,
    );
    return res.status(200).json({ comment: updatedComment });
  } catch (e) {
    return next(e);
  }
};

const handleDeletePostComment = async (req, res, next) => {
  try {
    const { commentid } = req.query;
    const postCommentServiceInstance = Container.get(PostCommentService);
    await postCommentServiceInstance.deletePost(req.currentUser.id, commentid);
    return res.status(200).end();
  } catch (e) {
    return next(e);
  }
};

const handleGetPostScore = async (req, res, next) => {
  try {
    const { id } = req.parmas;
    const postScoreServiceInstance = Container.get(PostScoreService);
    const score = await postScoreServiceInstance.findPostScore(
      id,
      req.currentUser.id,
    );
    return res.status(200).json({ score });
  } catch (e) {
    return next(e);
  }
};

const handleCreatePostScore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { score } = req.body;
    const postScoreServiceInstance = Container.get(PostScoreService);
    const createdScore = await postScoreServiceInstance.createPostScore(
      id,
      req.currentUser.id,
      score,
    );
    return res.status(200).json({ score: createdScore });
  } catch (e) {
    return next(e);
  }
};

const handleUpdatePostScore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { score } = req.body;
    const postScoreServiceInstance = Container.get(PostScoreService);
    const updatedScore = await postScoreServiceInstance.updatePostScore(
      id,
      req.currentUser.id,
      score,
    );
    return res.status(200).json({ score: updatedScore });
  } catch (e) {
    return next(e);
  }
};

const handleDeletePostScore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const postScoreServiceInstance = Container.get(PostScoreService);
    await postScoreServiceInstance.deletePostScore(id, req.currentUser.id);
    return res.status(200).end();
  } catch (e) {
    return next(e);
  }
};

const postController = {
  handleGetPostIds,
  handleGetPost,
  handleCreatePost,
  handleUpdatePost,
  handleDeletePost,
  handleGetPostCommentOrIds,
  handleCreatePostComment,
  handleUpdatePostComment,
  handleDeletePostComment,
  handleGetPostScore,
  handleCreatePostScore,
  handleUpdatePostScore,
  handleDeletePostScore,
};

export default postController;

import PostService from '@/services/post';
import createHttpError from 'http-errors';

describe('Post service unit tests', () => {
  describe('PostService constructor tests', () => {
    const postServiceInstance = new PostService();

    it('<PostService.constructor> properties are undefined', () => {
      expect(postServiceInstance.userModel).toBeUndefined();
      expect(postServiceInstance.postModel).toBeUndefined();
      expect(postServiceInstance.postScoreModel).toBeUndefined();
      expect(postServiceInstance.postCommentModel).toBeUndefined();
    });
  });

  describe('PostService.findPostIds method tests', () => {
    const postModel = { findByOrderByCreated: jest.fn() };
    const postServiceInstance = new PostService({ postModel });

    it('<PostService.findPostIds> returns post id list', async () => {
      const postList = [{ id: 1 }, { id: 2 }, { id: 3 }];
      postModel.findByOrderByCreated.mockResolvedValue(postList);
      const res = await postServiceInstance.findPostIds();
      expect(res).toEqual([1, 2, 3]);
    });

    it('<PostService.findPostIds> throw http error(unable to find post)', async () => {
      postModel.findByOrderByCreated.mockRejectedValue(new Error('Error'));
      await expect(postServiceInstance.findPostIds()).rejects.toThrow(
        createHttpError(400, 'unable to find posts'),
      );
    });
  });
});

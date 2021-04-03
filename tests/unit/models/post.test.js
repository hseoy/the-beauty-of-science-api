import PostModel from '@/models/post';
import connect from '@/loaders/postgres';

describe('Post model unit tests', () => {
  let db;
  let postModel;

  const mockPost = {
    authorid: 1,
    category: 'common',
    title: 'test_title',
    content: "bruno's post",
  };

  beforeAll(() => {
    db = connect();
    postModel = new PostModel(db);
  });

  afterAll(() => {
    db.destroy();
  });

  beforeEach(async () => {
    await postModel.transactionStart();
  });

  afterEach(async () => {
    await postModel.transactionRollback();
  });

  describe('PostModel.update methods test', () => {
    let createdPost;

    beforeEach(async () => {
      [createdPost] = await postModel.create(mockPost);
    });

    it('<PostModel.updateWith({id}> returns updated post object', async () => {
      const [updatedUser] = await postModel.updateWith(
        { id: createdPost.id },
        { title: `${createdPost.title}_UPDATED` },
      );
      expect(updatedUser.title).toBe(`${createdPost.title}_UPDATED`);
    });
  });

  describe('PostModel.find methods test', () => {
    const createdPosts = [];

    beforeAll(async () => {
      const posts = [
        { authorid: 1, category: 'a', title: '1', content: '1_1' },
        { authorid: 2, category: 'b', title: '2', content: '2_1' },
        { authorid: 3, category: 'c', title: '3', content: '3_1' },
        { authorid: 1, category: 'a', title: '4', content: '1_2' },
      ];
      posts.forEach(async post => {
        const [createdPost] = await postModel.create(post);
        createdPosts.push(createdPost);
      });
    });

    afterAll(async () => {
      createdPosts.forEach(async post => {
        await postModel.deleteBy({ id: post.id });
      });
    });

    it('<PostModel.findByOrderByCreated> returns post object array', async () => {
      const posts = await postModel.findByOrderByCreated(
        {
          category: createdPosts[0].category,
        },
        false,
      );
      expect(posts.length).toBe(2);
      expect(posts[0]).toMatchObject(createdPosts[0]);
      expect(posts[1]).toMatchObject(createdPosts[3]);
    });

    it('<PostModel.findByOrderByModified> returns post object array', async () => {
      const posts = await postModel.findByOrderByModified(
        {
          category: createdPosts[0].category,
        },
        false,
      );
      expect(posts.length).toBe(2);
      expect(posts[0]).toMatchObject(createdPosts[0]);
      expect(posts[1]).toMatchObject(createdPosts[3]);
    });
  });
});

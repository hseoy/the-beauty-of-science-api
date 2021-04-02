import PostModel from '@/models/post';
import connect from '@/loaders/postgres';

describe('Post model unit tests', () => {
  let db;
  let postModel;

  const mockPost = {
    author: 'bruno@foo.com',
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

  describe('PostModel.create methods test', () => {
    it('<PostModel.create> returns created post object', async () => {
      const [createdPost] = await postModel.create(mockPost);
      expect(createdPost).toMatchObject(mockPost);
    });
  });

  describe('PostModel.delete methods test', () => {
    let createdPost;

    beforeEach(async () => {
      [createdPost] = await postModel.create(mockPost);
    });

    it('<PostModel.deleteBy({id})> returns 1', async () => {
      const res = await postModel.deleteBy({ id: createdPost.id });
      expect(res).toBe(1);
    });

    it('<PostModel.deleteBy({author}) returns 1', async () => {
      const res = await postModel.deleteBy({ author: createdPost.author });
      expect(res).toBe(1);
    });
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
        { author: 'a@gmail.com', category: 'a', title: '1', content: '1_1' },
        { author: 'b@gmail.com', category: 'b', title: '2', content: '2_1' },
        { author: 'c@gmail.com', category: 'c', title: '3', content: '3_1' },
        { author: 'a@gmail.com', category: 'a', title: '4', content: '1_2' },
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

    it('<PostModel.findAll> returns post object array', async () => {
      const posts = await postModel.findAll();
      expect(posts.length).toBe(4);
      posts.forEach((post, i) => {
        expect(post).toMatchObject(createdPosts[i]);
      });
    });

    it('<PostModel.findBy({id})> returns post object', async () => {
      const [post] = await postModel.findBy({ id: createdPosts[0].id });
      expect(post).toMatchObject(createdPosts[0]);
    });

    it('<PostModel.findBy({author})> returns post object array', async () => {
      const posts = await postModel.findBy({ author: createdPosts[0].author });
      expect(posts.length).toBe(2);
      expect(posts[0]).toMatchObject(createdPosts[0]);
      expect(posts[1]).toMatchObject(createdPosts[3]);
    });

    it('<PostModel.findBy({category})> returns post object array', async () => {
      const posts = await postModel.findBy({
        category: createdPosts[0].category,
      });
      expect(posts.length).toBe(2);
      expect(posts[0]).toMatchObject(createdPosts[0]);
      expect(posts[1]).toMatchObject(createdPosts[3]);
    });

    it('<PostModel.findByOrderBy> returns post object array', async () => {
      const posts = await postModel.findByOrderBy(
        {
          category: createdPosts[0].category,
        },
        postModel.created,
        true,
      );
      expect(posts.length).toBe(2);
      expect(posts[0]).toMatchObject(createdPosts[3]);
      expect(posts[1]).toMatchObject(createdPosts[0]);
    });

    it('<PostModel.findByOrderBy> returns post object array', async () => {
      const posts = await postModel.findByOrderBy(
        {
          category: createdPosts[0].category,
        },
        postModel.created,
        false,
      );
      expect(posts.length).toBe(2);
      expect(posts[0]).toMatchObject(createdPosts[0]);
      expect(posts[1]).toMatchObject(createdPosts[3]);
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

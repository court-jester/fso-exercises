const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  // .forEach may cause problems with asynchronous code, better use Promise.all or for..of
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe('when there is initially some notes saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-type', /application\/json/);

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');

    const title = response.body.map(blog => blog.title);

    expect(title).toContain('React patterns');
  });
  test('the first blog is written by Michael Chan', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].author).toBe('Michael Chan');
  });

  test('the unique identifier property of the blogs is named id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined();
    });
  });
});

describe('addition of a new blogpost', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'The greatest test',
      author: 'Mokelele Embe',
      url: 'https://www.utepapaute.com',
      likes: 1
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-type', /application\/json/);

    const blogsAfterPost = await helper.blogsInDb();
    const titles = blogsAfterPost.map(blog => blog.title);

    expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length + 1);
    expect(titles).toContain('The greatest test');
  });

  test('fails with status code 400 if the title is missing', async () => {
    const newBlog = {
      author: 'Mokelele Embe',
      url: 'https://www.utepapaute.com',
      likes: 1
    };
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-type', /application\/json/);

    expect(response.body.error).toBe(
      'Blog validation failed: title: Path `title` is required.'
    );
  });

  test('defaults likes to 0 if the likes property is missing', async () => {
    const newBlog = {
      title: 'The greatest test',
      author: 'Mokelele Embe',
      url: 'https://www.utepapaute.com'
    };

    const response = await api.post('/api/blogs').send(newBlog).expect(201);

    expect(response.body.likes).toBe(0);
  });

  test('fails with status code 400 if title and/or url are missing', async () => {
    const newBlog = {
      author: 'Mokelele Embe',
      likes: 1
    };
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-type', /application\/json/);

    expect(response.body.error).toBe(
      'Blog validation failed: title: Path `title` is required., url: Path `url` is required.'
    );
  });
});
describe('deletion of a blog', () => {
  test('succeeds with status code 204 if ID is valid', async () => {
    const blogsBeforeDeletion = await helper.blogsInDb();
    const blogToDelete = blogsBeforeDeletion[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAfterDeletion = await helper.blogsInDb();
    expect(blogsAfterDeletion).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAfterDeletion.map(blog => blog.title);
    expect(titles).not.toContain(blogsBeforeDeletion.title);
  });

  test('fails with status code 400 and if ID is invalid', async () => {
    const invalidId = '123';

    const response = await api.delete(`/api/blogs/${invalidId}`).expect(400);

    expect(response.body.error).toBe('malformatted id');
  });
});

afterAll(() => {
  mongoose.connection.close();
});

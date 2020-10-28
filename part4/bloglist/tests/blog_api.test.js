const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');
let token = null;

beforeEach(async () => {
  await User.deleteMany({});

  // NOTE: Another way of getting a valid token and user could be by using the api route /api/login before each or all tests. To check: pros and cons of different approaches to send authenticated requests
  const newUser = await helper.addUserInDb('nameofUser');
  token = helper.createToken(newUser);

  await Blog.deleteMany({});
  // .forEach may cause problems with asynchronous code, better use Promise.all or for..of
  for (let blog of helper.initialBlogs) {
    // Add the user id to the created blogs
    blog.user = newUser._id;
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
      .set('Authorization', `bearer ${token}`)
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
      .set('Authorization', `bearer ${token}`)
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

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(201);

    expect(response.body.likes).toBe(0);
  });

  test('fails with status code 400 if title and url are missing', async () => {
    const newBlog = {
      author: 'Mokelele Embe',
      likes: 1
    };
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(400)
      .expect('Content-type', /application\/json/);

    expect(response.body.error).toBe(
      'Blog validation failed: title: Path `title` is required., url: Path `url` is required.'
    );
  });

  test('fails with status code 401 if the token is missing', async () => {
    const newBlog = {
      title: 'The greatest test',
      author: 'Mokelele Embe',
      url: 'https://www.utepapaute.com',
      likes: 1
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-type', /application\/json/);

    expect(response.body.error).toBe('invalid token');
  });

  test('fails with status code 401 if the token is invalid', async () => {
    const newBlog = {
      title: 'The greatest test',
      author: 'Mokelele Embe',
      url: 'https://www.utepapaute.com',
      likes: 1
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer invalidtoken33923838949282`)
      .expect(401)
      .expect('Content-type', /application\/json/);

    expect(response.body.error).toBe('invalid token');
  });
});

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if ID is valid', async () => {
    const blogsBeforeDeletion = await helper.blogsInDb();
    const blogToDelete = blogsBeforeDeletion[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);

    const blogsAfterDeletion = await helper.blogsInDb();
    expect(blogsAfterDeletion).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAfterDeletion.map(blog => blog.title);
    expect(titles).not.toContain(blogsBeforeDeletion.title);
  });

  test('fails with status code 400 and if ID is invalid', async () => {
    const invalidId = '123';

    const response = await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `bearer ${token}`)
      .expect(400);

    expect(response.body.error).toBe('malformatted id');
  });

  test('fails with status code 401 if the token is missing', async () => {
    const [blogToDelete] = await helper.blogsInDb();

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401);

    expect(response.body.error).toBe('invalid token');
  });
});

describe('modification of a blog', () => {
  test('succeeds with valid data', async () => {
    const blogs = await helper.blogsInDb();
    const blogToUpdate = blogs[0];

    // Probably blogToUpdate.likes++ would work, instead of creating a new filled blog object
    const modifyLikes = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: 50
    };
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(modifyLikes)
      .expect(200)
      .expect('Content-type', /application\/json/);

    // const blogUpdated = { ...blogToUpdate, likes: 50 };

    const blogsAfterPut = await helper.blogsInDb();
    const updatedBlog = blogsAfterPut[0];

    // NOTE: Maybe use another matcher instead of creating and using a function to parse the user field of a blog for succeeds the .toEqual matcher
    const parsedBlog = helper.parseBlogUser(updatedBlog);

    expect(response.body).toEqual(parsedBlog);
  });

  test('fails with status code 400 if data is invalid', async () => {
    const blogs = await helper.blogsInDb();
    const blogToUpdate = blogs[0];

    const invalidBlogUpdate = {
      author: blogToUpdate.author,
      likes: 50
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(invalidBlogUpdate)
      .expect(400)
      .expect('Content-type', /application\/json/);

    expect(response.body.error).toBe(
      'Validation failed: url: Path `url` is required., title: Path `title` is required.'
    );
  });

  test('fails with status code 400 if ID is invalid', async () => {
    const invalidId = '123';

    const response = await api.put(`/api/blogs/${invalidId}`).expect(400);

    expect(response.body.error).toBe('malformatted id');
  });
});

afterAll(() => {
  mongoose.connection.close();
});

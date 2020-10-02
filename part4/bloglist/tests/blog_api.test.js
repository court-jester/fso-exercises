const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

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

test('a valid blog can be added', async () => {
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

test('an invalid blog can not be added', async () => {
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

test('if the likes property is missing, default its value to 0', async () => {
  const newBlog = {
    title: 'The greatest test',
    author: 'Mokelele Embe',
    url: 'https://www.utepapaute.com'
  };

  const response = await api.post('/api/blogs').send(newBlog).expect(201);

  expect(response.body.likes).toBe(0);
});

afterAll(() => {
  mongoose.connection.close();
});

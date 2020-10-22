const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const bcrypt = require('bcrypt');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({ username: 'defaultUser', passwordHash });

    await user.save();
  });

  test('creation succeeds if valid payload is passed', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'peter',
      name: 'Peter McManaman',
      password: 'unknown'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails if username's already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'defaultUser',
      name: 'Creation Failure',
      password: 'failuser'
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain('`username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails if username is undefined', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: 'Creation Failure',
      password: 'failuser'
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('username is missing');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails if password is undefined', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'name123',
      name: 'Creation Failure'
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('password is missing');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails if username is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'lo',
      name: 'Creation Failure',
      password: 'failuser'
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain(
      `\`username\` (\`${newUser.username}\`) is shorter than the minimum allowed`
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails if the password is less than 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'low',
      name: 'Creation Failure',
      password: 'ko'
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe(
      'password must have, at least, 3 characters long'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

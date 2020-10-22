const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');
const { ValidationError } = require('../utils/custom_errors');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1
  });
  res.json(users);
});

usersRouter.post('/', async (req, res) => {
  const body = req.body;

  if (!body.username) {
    throw new ValidationError('username is missing');
  }

  if (!body.password) {
    throw new ValidationError('password is missing');
  }

  if (body.password.length < 3) {
    throw new ValidationError(
      'password must have, at least, 3 characters long'
    );
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

module.exports = usersRouter;

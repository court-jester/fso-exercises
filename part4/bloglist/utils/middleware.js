const logger = require('./logger');

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Body:  ', req.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (e, req, res, next) => {
  logger.error(e.message);

  if (e.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (e.name === 'ValidationError') {
    return res.status(400).json({ error: e.message });
  } else if (e.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token'
    });
  }

  next(e);
};

// Isolates the token from the authorization header of the request (it uses the Bearer authentication scheme)
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  }

  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor
};

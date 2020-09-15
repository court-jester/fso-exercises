if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const app = express();

const logger = (req, res, next) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Body:  ', req.body);
  console.log('---');
  next();
};
// Logs HTTP POST request data
morgan.token('post', req => {
  if (req.body.name && req.body.number) return JSON.stringify(req.body);
  return null;
});

app.use(cors());
app.use(express.json());
app.use(express.static('build'));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :post')
);
app.use(logger);

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});

app.get('/info', (req, res, next) => {
  Person.estimatedDocumentCount()
    .then(result => {
      res.send(`Phonebook has info for ${result} people
      \n${new Date()}`);
    })
    .catch(e => next(e));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(e => next(e));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(e => next(e));
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;
  const person = new Person({
    name: body.name,
    number: body.number
  });

  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(e => next(e));
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;
  const person = {
    number: body.number
  };

  // Response with the modified person
  // Run validators using this function (by default it doesn't)
  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: true
  })
    .then(updatedPerson => {
      res.json(updatedPerson);
    })
    .catch(e => next(e));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (e, req, res, next) => {
  console.error(e.message);

  if (e.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (e.name === 'ValidationError') {
    return res.status(400).json({ error: e.message });
  }
  next(e);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

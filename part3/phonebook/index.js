require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const app = express();

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

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4
  }
];

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people
  \n${new Date()}`);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(e => next(e));
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing'
    });
  }

  const nameExists = persons.some(person => person.name === body.name);
  if (nameExists) {
    return res.status(400).json({
      error: 'name must be unique'
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });
  person.save().then(savedPerson => {
    res.json(savedPerson);
  });
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;
  if (body.number === undefined) {
    return res.status(400).json({ error: 'content missing' });
  }

  const person = {
    number: body.number
  };

  // Response with the modified person
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
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
  }
  next(e);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const mongoose = require('mongoose');
if (process.argv.length !== 5 && process.argv.length !== 3) {
  console.log(
    'Please use the following structure to add a person: node mongo.js <password> <name> <number>'
  );
  console.log(
    'Or just node mongo.js <password> to display all entries in the phonebook'
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@phonebook.7nvbc.mongodb.net/Phonebook?retryWrites=true&w=majority`;
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(e => console.error(e));

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);
if (process.argv.length === 3) {
  Person.find({}).then(persons => {
    console.log('phonebook:');
    persons.forEach(person => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });

  person.save().then(() => {
    console.log(
      `Added ${process.argv[3]} number ${process.argv[4]} to phonebook`
    );
    mongoose.connection.close();
  });
}

const mongoose = require('mongoose');
// Mongoose does not offer a unique validator
const uniqueValidator = require('mongoose-unique-validator');
mongoose.set('useFindAndModify', false);
// Solve the warning created by mongoose-unique-validator
mongoose.set('useCreateIndex', true);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch(e => {
    console.log('error connecting to MongoDB', e.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  number: {
    type: String,
    required: true
  }
});

personSchema.plugin(uniqueValidator);
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);

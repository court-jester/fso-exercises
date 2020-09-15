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
    unique: true,
    minlength: 3
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: v => v.match(/\d/g).length >= 8,
      message: props => `${props.value} is not a valid phone number`
    }
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

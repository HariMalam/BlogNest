const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
  name: {
    familyName: {
      type: String,
      required: true,
    },
    givenName: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  type: {
    type: String,
    default: 'user',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
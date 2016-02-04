var mongoose = require('mongoose');
var schema = new mongoose.Schema({
  password: {
    required: true,
    type: String
  },
  username: {
    required: true,
    type: String
  }
});

module.exports = mongoose.model('User', schema);

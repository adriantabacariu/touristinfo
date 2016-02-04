var mongoose = require('mongoose');
var schema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  location: {
    index: '2dsphere',
    required: true,
    type: [Number]
  },
  description: String
});

module.exports = mongoose.model('Place', schema);

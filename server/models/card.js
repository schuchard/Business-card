var mongoose = require('mongoose');

var cardSchema = mongoose.Schema({
  firstName: String,
  lastName: String
});

module.exports = mongoose.model('Card', cardSchema);
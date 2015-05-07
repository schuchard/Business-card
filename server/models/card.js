var mongoose = require('mongoose');

var cardSchema = mongoose.Schema({
  formattedName: String,
  positions: Object,
  industry: String,
  description: String,
  skills: Object,
  location: Object,
  pictureUrl: String,
  profileUrl: String,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Card', cardSchema);
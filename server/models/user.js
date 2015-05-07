var mongoose = require('mongoose');
// var Cards = require('./card.js');

var Card = new mongoose.Schema({
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

var userSchema = mongoose.Schema({
  authID: String,
  firstName: String,
  lastName: String,
  formattedName: String,
  image: String,
  created: String,
  accessToken: String,
  cards: [Card]
});

var User = mongoose.model('User', userSchema);

module.exports = User;
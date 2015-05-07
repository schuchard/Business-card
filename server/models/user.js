var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  authID: String,
  firstName: String,
  lastName: String,
  formattedName: String,
  image: String,
  created: String,
  accessToken: String,
  cards: Array
});

var User = mongoose.model('User', userSchema);

module.exports = User;
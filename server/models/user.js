var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  authID: String,
  firstName: String,
  lastName: String,
  formattedName: String,
  email: String,
  phoneNumber: String,
  headline: String,
  description: String,
  industry: String,
  skills: String,
  location: String,
  image: String,
  created: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;
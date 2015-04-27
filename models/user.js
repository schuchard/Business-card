var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  linkedInID: String,
  firstName: String,
  lastName: String,
  formattedName: String,
  email: String,
  phoneNumber: String,
  headline: String,
  description: String,
  industry: String,
  positions: String,
  skills: String,
  location: String,
  image: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;
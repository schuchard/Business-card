var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  liId: String,
  name: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;
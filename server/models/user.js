var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var ObjectId = mongoose.Types.ObjectId();
// var ObjectID = new ObjectId;

var userSchema = new Schema({
  authID: String,
  firstName: String,
  lastName: String,
  formattedName: String,
  image: String,
  created: String,
  accessToken: String,
  cards: [{
      type: Schema.ObjectId,
      ref: 'Card'
  }]
});

var User = mongoose.model('User', userSchema);

module.exports = User;
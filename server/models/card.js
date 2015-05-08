var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cardSchema = new Schema({
  formattedName: String,
  positions: Object,
  industry: String,
  description: String,
  skills: Object,
  location: Object,
  pictureUrl: String,
  profileUrl: String,
  creator: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Card', cardSchema);
var mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {
    minLength: 1,
    trim: true,
    require: true,
    type: String
  }
});

module.exports = {
  User
}

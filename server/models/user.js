const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    minlength: 1,
    trim: true,
    required: true,
    type: String,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
    }
  },
    password: {
      required: true,
      type: String,
      minlength: 6
    },
    tokens:[{
      access:{
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]

});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access},'abc123').toString();
  user.tokens.push({access, token});

  return user.save().then(()=>{
    return token;
  });
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
  decoded = jwt.verify(token, 'abc123');
  }  catch (e){
    // return new Promise((resolve, reject) => {
    // reject();
    // });
    //INACZEJ:
    return Promise.reject();
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = {
  User
}

// mozna tez napisac validator: validator.isEmail zamiast tego jak jest

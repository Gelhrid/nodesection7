const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'michal@gmail.com',
    password: 'jakieshaslo123!',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'},'abc123').toString()
    }]
  },
    {
      _id: userTwoId,
      email: 'kasia@gmail.com',
      password: 'hasloKasi123!!'
    }];

const todos = [{
  _id: new ObjectID(),
  text: 'first testt todo'}, {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 123}];

    const populateTodos = (done) => {
      Todo.remove({}).then(() => {
          return Todo.insertMany(todos);
      }).then(()=>done());
    };

    const populateUsers = (done) => {
      User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User (users[1]).save();

        return Promise.all([userOne, userTwo]);
        //jak bez returna i po Promise.all bylby then to by sie to wywolywano  bo tych all a
        //my chemy zeby sie wywolywana nakoncu czy po tym sukcecie jako sukces remove
      }).then(() => done());
    };

    module.exports = {
      todos,
      populateTodos,
      populateUsers,
      users
    }

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {ObjectID} = require('mongodb');
var id = '59dcb35950ca760c14274899';

Todo.find({
  _id: id
}).then((todos) => {
  console.log('Todos', todos);
}).catch((e) => {
  console.log(e);
});

Todo.findOne({
  _id: id
}).then((todo) => {
  console.log('Todos', todo);
}).catch((e) => {
  console.log(e);
});

Todo.findById(id).then((todo) => {
  console.log('Todos', todo);
}).catch((e) => {
  console.log(e);
});

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {ObjectID} = require('mongodb');



//Todo.remove
// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove({}).then((result) => {
//   console.log(result);
// });

Todo.findByIdAndRemove('59e1d5406411bfab7ed5f28b').then((todo) => {
  console.log(todo);
});

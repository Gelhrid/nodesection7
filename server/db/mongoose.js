var mongoose = require('mongoose');


mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://admin:admin@ds121015.mlab.com:21015/todo');
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports.mongoose;

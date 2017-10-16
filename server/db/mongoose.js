var mongoose = require('mongoose');


mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://admin:admin@ds121015.mlab.com:21015/todo');
mongoose.connect(process.env.MONGODB_URI);
//'mongodb://localhost:27017/TodoApp'

module.exports.mongoose;

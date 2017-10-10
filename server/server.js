var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc) => {
    res.send(doc);
  }, (e)=>{
    res.status(400).send( `error ${e}`);
  })
});




app.listen(3000, () => {
  console.log('started onport 3000');
});

// var newUser = new User(()=>{
//   email: "michal.kodz@gmail.com"
// });
//
// newUser.save().then((doc) => {
//   console.log(` udalo sie znowu zasaveowac: ${doc}`);
// }).catch((error) => {
//   console.log(`cos sie popsuloL ${error}`);
// });
//
// var newTodo = new Todo({
//   text: "uczyc sie"
// });
//
// var newTodo2 = new Todo({
//   text: "uczyc sie",
//   completed: false,
//   completedAt: new Date().getTime()
// });
//
// // newTodo.save().then((doc) => {
// //   console.log('Save todo', doc);
// // }, (e) => {
// //   console.log('Unable to save todo');
// // });
//
// newTodo2.save().then((doc) => {
//   console.log(` udalo sie znowu zasaveowac: ${doc}`);
// }).catch((error) => {
//   console.log(`cos sie popsuloL ${error}`);
// });

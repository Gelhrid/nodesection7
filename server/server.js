require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
const port = process.env.PORT;


var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }

  ).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send('chyba cie pojebalo zly IDsX');
  }
  Todo.findById(id).then((todo) => {
    if(!todo){
        return res.status(404).send();
    }
      res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send('chyba cie pojebalo zly ID');
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
        return res.status(404).send();
    }
      res.send({todo});
  }).catch((e) => {
    res.status(400).send();
    });
  });

  app.patch('/todos/:id', (req, res)=> {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if(!ObjectID.isValid(id)){
      return res.status(404).send('chyba cie pojebalo zly ID');
    }

    if(_.isBoolean(body.completed) && body.completed){
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
      if(!todo){
          return res.status(404).send('chyba cie pojebalo zly ID');
      }
      res.send({todo});
    }).catch((e) =>{
        res.status(400).send();
    });

  });

  app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});


//+++++++++++++++++++++++++++++++++++++++++++++++++++++
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};

// var newUser = new User(()=>{
//   email: "michal.kodz@gmail.com"
// });
// newUser.save().then((doc) => {
//   console.log(doc);
// }, (e) => {
//   console.log(e);
// });

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

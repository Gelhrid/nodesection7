require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
// var test = require('./server2');
var {authenticate} = require('./middleware/authenticate');
const port = process.env.PORT;


var app = express();

app.use(bodyParser.json());
// test.cos(app);
app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos})
  }

  ).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send('chyba cie pojebalo zly IDsX');
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo){
        return res.status(404).send();
    }
      res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', authenticate, async(req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send('chyba cie pojebalo zly ID');
  }
  try{
      const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });
    if(!todo){
        return res.status(404).send();
    }
      res.send({todo});

  }catch(e)  {
    res.status(400).send();
  };
  });

  app.patch('/todos/:id', authenticate, (req, res)=> {
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

    Todo.findOneAndUpdate({
      _id: id,
      _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
      if(!todo){
          return res.status(404).send('chyba cie pojebalo zly ID');
      }
      res.send({todo});
    }).catch((e) =>{
        res.status(400).send();
    });

  });

  app.post('/users', async(req, res) => {
    try{
      const body = _.pick(req.body, ['email', 'password']);
      const user = new User(body);
      await user.save();
      const token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);
    }catch(e){
      res.status(400).send(e);
    }
  });

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', async(req, res) => {
    try{
      const body = _.pick(req.body, ['email', 'password']);
      const user = await User.findByCredentials(body.email, body.password);
      const token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);
    } catch(e){
      res.status(400).send(e);
    }
});
// app.post('/users/login', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password']);
//
//   User.findByCredentials(body.email, body.password).then((user) => {
//     return user.generateAuthToken().then((token) => {
//         res.header('x-auth', token).send(user);
//     });
//   }).catch((e) => {
//     res.status(400).send(e);
//   });
// });


app.delete('/users/me/token', authenticate, async (req, res) => {
  try{
    await req.user.removeToken(req.token);
    res.status(200).send();
}catch(e){
  res.status(400).send();
}
});
// app.delete('/users/me/token', authenticate, (req, res) => {
//   req.user.removeToken(req.token).then(() => {
//     res.status(200).send();
//   }).catch(() => {
//     res.status(400).send();
//   })
// });


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

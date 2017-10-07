// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

// var user = {name: 'andrew', age: 25};
// var {name} = user;
// console.log(name);


MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('unable to connect to mongodb server');
  }

  console.log('connected to mongodb server');
db.collection('Users').findOneAndUpdate({_id: new ObjectID('59d87de2ab9d7d08c4106141')}, {$inc: {age: 111}}).then((result) => {
  console.log(result);
});


  // db.close();
});

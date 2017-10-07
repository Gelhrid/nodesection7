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
//delete many
// db.collection('Todos').deleteMany({text: 'jakistext'}).then((result) => {
//   console.log(result);
// });

//deleteOne
// db.collection('Todos').deleteOne({text: 'jakistext2'}).then((result) => {
//   console.log(result);
// });

//findOneAndDelete
db.collection('Todos').findOneAndDelete({text: 'jakistext2'}).then((result) => {
  console.log(result);
});


  // db.close();
});

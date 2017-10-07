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

// db.collection('Todos').insertOne({
//   text: 'cos tam dodalem',
//   completed: false
// } ,(err, result) => {
//   if(err){
//     return console.log("cos sie zjebalo przy tworzeeniu inserta", err);
//   }
//   console.log('udalo sie',  JSON.stringify(result.ops, undefined, 2));
// });

// db.collection('Users').insertOne({
//   name: 'Michal Kodz',
//   age: 30,
//   location: 'Na Skarpie 42/63'
// } ,(err, result) => {
//   if(err){
//     return console.log("cos sie zjebalo przy tworzeeniu inserta", err);
//   }
//   console.log('udalo sie',  JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
// });
//




  db.close();
});

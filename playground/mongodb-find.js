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
// db.collection('Todos').find({_id: new ObjectID('59d648ec95fdf918c4daaef4')}).toArray().then((docs) => {
//     console.log('Todos');
//     console.log(JSON.stringify(docs, undefined, 2));
// }, (err) => {
//   console.log('unable to fetch todos', err);
// });
// db.collection('Todos').find().count((b,c)=>{
//   console.log(c);
// });

db.collection('Todos').find({liczba: {$gte:1}}).toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
}, (err) => {
  console.log('unable to fetch todos', err);
});



  // db.close();
});

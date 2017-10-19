const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (error, salt) => {
//   bcrypt.hash(password, salt, (error, hash) => {
//     console.log(hash);
//   });
// });

var hashedPassword = '$2a$10$nBjI50MmD.XW9uomCjzJouSzNyj2uJ3pLcRhGL/cZ5vZaZ71q0zgm';
bcrypt.compare(password, hashedPassword, (err, res) =>{
  console.log(res);
});


//
//
// var data = {
//   id: 10
// };
//
//
// var token = jwt.sign(data, '123abc');
//
// console.log(token);
//
// var decoded =jwt.verify(token, '123abc');
// console.log(decoded);

// var message = 'I am use number 3';
// var hash = SHA256(message).toString();
//
// console.log(hash);

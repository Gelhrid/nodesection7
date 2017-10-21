const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

//ten test pocwiczyc ze by rozumiec czemu w end jest sekcja etc
// zeby nie z pamieci a z rozumu wiedziec to
  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});


describe('GET /todos', () => {
  it('should get all todos', (done) => {
      request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });

  });

  describe('GET /todos/:id', () => {
    it('should return a todo doc', (done) => {
      request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) =>{
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
    });

    it('should not return todo doc created by other user', (done) => {
      request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
    });

    it('should return 404 not found when id not found', (done) => {
      request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
    });

    it('should return 404 for non ObjectId', (done) => {
      request(app)
      .get(`/todos/123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
    });

  });

    describe('DELETE /todos/:id', () => {
      it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
          if(err){
            return done(err);
          }
          Todo.findById(hexId).then((todo) =>{
            expect(todo).toNotExist();
            done();
          }).catch((e) => done(e));

        });
      });

      it('should not remove a todo created by other user', (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end((err, res) => {
          if(err){
            return done(err);
          }
          Todo.findById(hexId).then((todo) =>{
            expect(todo).toExist();
            done();
          }).catch((e) => done(e));

        });
      });

      it('should return 404 if todo not found', (done) => {
        request(app)
        .delete(`/todos/${new ObjectID().toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
      });

      it('should return 400 if objectId is invalid', (done) => {
        request(app)
        .delete(`/todos/123`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
      });
    });

      describe('UPDATE PATCH /todos/:id', () => {
        it('should update the todo', (done) => {
          var hexId = todos[0]._id.toHexString();
          var newTodo= {
            text: 'xxx',
            completed: true
          };
          request(app)
          .patch(`/todos/${hexId}`)
          .set('x-auth', users[0].tokens[0].token)
          .send(newTodo)
          .expect(200)
          .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
            expect(res.body.todo.text).toBe(newTodo.text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
          })
          .end((err, res) => {
            if(err){
              return done(err);
            }
            //ta czesc srednio potrzebna bo wyzej juz sporawdezan obiekt jaki jest zwracany
            //i wtedy sekcja z end(...) bylaby inna
            Todo.findById(hexId).then((todo) =>{

              expect(todo.text).toBe(newTodo.text);
              expect(todo.completed).toBe(true);
              done();
            }).catch((e) => done(e));
        });
        });

        it('should not update the todo when is different creator', (done) => {
          var hexId = todos[0]._id.toHexString();
          var newTodo= {
            text: 'xxx',
            completed: true
          };
          request(app)
          .patch(`/todos/${hexId}`)
          .set('x-auth', users[1].tokens[0].token)
          .send(newTodo)
          .expect(404)
          .end((err, res) => {
            if(err){
              return done(err);
            }
            Todo.findById(hexId).then((todo) =>{
              expect(todo).toExist();
              done();
            }).catch((e) => done(e));
        });
        });

        it('should clear completedAt when todo is not completed', (done) => {
          var hexId = todos[1]._id.toHexString();
          var newTodo= {
            text: 'yyy',
            completed: false
          };
          request(app)
          .patch(`/todos/${hexId}`)
          .set('x-auth', users[1].tokens[0].token)
          .send(newTodo)
          .expect(200)
          .expect((res) => {
              expect(res.body.todo.completed).toBe(false);
              expect(res.body.todo._id).toBe(hexId);
              expect(res.body.todo.text).toBe(newTodo.text);
          })
          .end((err, res) => {
            if(err){
              return done(err);
            }
            //ta czesc srednio potrzebna bo wyzej juz sporawdezan obiekt jaki jest zwracany
            //i wtedy sekcja z end(...) bylaby inna
            Todo.findById(hexId).then((todo) =>{
              expect(todo.completedAt).toNotExist();
              expect(todo.completed).toBe(false);
              done();
            }).catch((e) => done(e));
        });
      });
      });

        describe('GET /users/me', () => {
            it('should return user if authenticated', (done) => {
              request(app)
              .get('/users/me')
              .set('x-auth', users[0].tokens[0].token)
              .expect(200)
              .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
              })
              .end(done);
            });

            it('should return 401 if no authenticated', (done) => {
              request(app)
              .get('/users/me')
              .expect(401)
              .expect((res) => {
                expect(res.body).toEqual({});
              })
              .end(done);
            });
        });

    describe('POST /users', () => {
      it('should create a user', (done) => {
        var email = 'test@gmail.com';
        var password = '321dasfd!';
        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toExist();
          expect(res.body._id).toExist();
          expect(res.body.email).toBe(email);
        })
        .end((error) => {
          if(error){
            return done(error);
          }

          User.findOne({email}).then((user) => {
            expect(user).toExist();
            expect(user.password).toNotBe(password);
            done();
          }).catch((e) => { done(e);});
        });
      });

      it('should return validation errors if request invalid', (done) => {
        var email = 'testgmail.com';
        var password = '1!';
        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .expect((res) => {
          expect(res.headers['x-auth']).toNotExist();
          expect(res.body._id).toNotExist();
          expect(res.body.email).toNotExist();
        })
        .end(done);
        });


      it('should not create user if email in use', (done) => {
        var email = users[0].email;
        var password = '1fdgdfsgert!';
        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .expect((res) => {
          expect(res.headers['x-auth']).toNotExist();
          expect(res.body._id).toNotExist();
          expect(res.body.email).toNotExist();
        })
        .end(done);
        });

    });

    describe('POST /users/login', () => {
      it('should user and return auth token', (done) => {
        request(app)
        .post('/users/login/')
        .send({
          email: users[1].email,
          password: users[1].password
        })
        .expect(200)
        .expect((res) =>{
          expect(res.header['x-auth']).toExist();
        })
        .end((error, res) => {
          if(error){
            return done(error);
          }

          User.findById(users[1]._id).then((user) => {
            expect(user.tokens[1]).toInclude({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          }).catch((e) => {
            done(e);
          });
        });
      });

      it('should reject invalid login', (done) => {
        request(app)
        .post('/users/login/')
        .send({
          email: users[1].email,
          password: 'zleHaslo'
        })
        .expect(400)
        .expect((res) =>{
          expect(res.header['x-auth']).toNotExist();
        })
        .end((error) => {
          if(error){
            return done(error);
          }

          User.findById(users[1]._id).then((user) => {
            expect(user.tokens.length).toBe(1);
            done();
          }).catch((e) => {
            done(e);
          });
        });
      });
    });

    describe('DELETE /users/me/token', () => {
      it('should remove of tokent on logut', (done) => {
        var token = users[0].tokens[0];
        request(app)
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token)
        .send()
        .expect(200)
        .end((err) => {
          if(err){
            return done(error);
          }

          User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => {
          done(e);
        });
      });
      });
    });

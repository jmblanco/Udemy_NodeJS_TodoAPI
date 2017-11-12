const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

var { app } = require('../server');
var { Todo } = require('../models/todo.model');
var { User } = require('../models/user.model');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

// Empty Todos
beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
    it('Should create a new Todo', (done) => {
        var text = 'Test Todo Text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('Should NOT create a new Todo, invalid body data', (done) => {
        request(app).post('/todos').send()
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(todos.length);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });
});

describe('GET /todos', () => {
    it('Should get ALL Todo tasks', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(todos.length);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('Should return a Todo task by ID', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('Should return 404 if Todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('Should return 404 if ID is not valid', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('Should remove a Todo task by ID', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(todos[0]._id).then((todo) => {
                    expect(todo).toBeNull();
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('Should return 404 if Todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('Should return 404 if ID is not valid', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('Should update a not complete Todo task by ID', (done) => {
        var updatedTodo = {
            text: 'First Todo Updated',
            completed: true
        };
        var idHex = todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${idHex}`)
            .send(updatedTodo)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(updatedTodo.text);
                expect(res.body.todo.completed).toBeTruthy(); //toBe(true)
                expect(res.body.todo.completedAt).not.toBe(null); //toBeA('number')
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    it('Should update a complete Todo task by ID', (done) => {
        var updatedTodo = {
            text: 'Second Todo Updated',
            completed: false
        };
        var idHex = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${idHex}`)
            .send(updatedTodo)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(updatedTodo.text);
                expect(res.body.todo.completed).not.toBeTruthy();
                expect(res.body.todo.completedAt).toBe(null);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    it('Should return 404 if Todo not found', (done) => {
        request(app)
            .patch(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('Should return 404 if ID is not valid', (done) => {
        request(app)
            .patch('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('Should return user if authenticated', (done) => {
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

    it('Should return 401 if not authenticated', (done) => {
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
    it('Should create a User', (done) => {
        var userToCreate = {
            email: 'luzisa@gmail.com',
            password: '123abc!'
        };
        request(app)
        .post('/users')
        .send(userToCreate)
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).not.toBeNull();
            expect(res.body.user._id).not.toBeNull();
            expect(res.body.user.email).toBe(userToCreate.email);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            User.findOne({ email: userToCreate.email }).then((user) => {
                expect(user).not.toBeNull();
                expect(user.password).not.toBe(userToCreate.password);
                done();
            }).catch((err) => {
                done(err);
            });
        });
    });

    it('Should return validation errors if request invalid', (done) => {
        var userToCreate = {
            email: 'jmblanco',
            password: '123'
        };
        request(app)
        .post('/users')
        .send(userToCreate)
        .expect(400)
        .end(done);
    });

    it('Should not create user if email is in use', (done) => {
        var userToCreate = {
            email: users[0].email,
            password: users[0].password
        };
        request(app)
        .post('/users')
        .send(userToCreate)
        .expect(400)
        .end(done);
    });
});

describe('POST /users/login', () =>{
    it('Should login user and return auth token', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).not.toBeNull();
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
            
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens[0]).not.toBeUndefined();
                expect(user.tokens[0].access).toBe('auth');
                expect(user.tokens[0].token).toBe(res.headers['x-auth']);
                done();
            }).catch((err) => done(err));
        });
    });

    it('Should reject invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password+'123'
        })
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeUndefined();
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
            
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((err) => done(err));
        });
    });
});
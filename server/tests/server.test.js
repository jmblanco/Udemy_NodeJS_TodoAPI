const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

var { app } = require('../server');
var { Todo } = require('../models/todo.model');

const todos = [
    { _id: new ObjectID(), text: 'First test Todo' },
    { _id: new ObjectID(), text: 'Second test Todo', completed: true, completedAt: new Date().getTime() }
];
// Empty Todos
beforeEach((done) => {
    Todo.remove().then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

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
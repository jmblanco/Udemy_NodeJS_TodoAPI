const expect = require('expect');
const request = require('supertest');

var {app} = require('../server');
var {Todo} = require('../models/todo.model');

const todos = [
    {text: 'First test Todo'},
    {text: 'Second test Todo'}
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
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
            Todo.find({text}).then((todos) => {
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
            if(err){
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
        .end((err, res) => {
            if(err){
                return done(err);
            }
            done();
        });
    });
});
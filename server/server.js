require('./config/config');

const _ = require('lodash');

var express = require('express');
const bodyParser = require('body-parser');

// Mongoose config
const {mongoose, ObjectID} = require('./db/mongoose');

// Models
var {Todo} = require('./models/todo.model');
var {User} = require('./models/user.model');

// Auth
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// Create resource (POST, JSON with Todo Info);
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send();
    });
});

// Get all todos (GET, return array of JSON with Todos)
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }, (err) => {
        res.status(400).send();
    });
});

// Get Todo by Id (GET /todos/id)
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send(); 
    }

    Todo.findById(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        
        res.status(200).send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});

// Delete Todo by ID (DELETE /todos/id)
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send(); 
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        
        res.status(200).send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)){
        return res.status(404).send(); 
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        
        res.status(200).send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});

// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }, (err) => {
        res.status(400).send();
    }).then((token) =>{
        res
        .header('x-auth', token)
        .send({user});
    }).catch((err) => {
        res.status(400).send();
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => { 
        user.generateAuthToken().then((token) => {
            res
            .header('x-auth', token)
            .send({user});
        });
    }).catch((err) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res
        .status(200).send();
    }).catch(() => {
        res
        .status(400).send();
    });
});

app.listen(port, () => console.log(`Express Server started at port ${port}`));

module.exports = {
    app
};

var express = require('express');
var bodyParser = require('body-parser');

// Mongoose config
var {mongoose, ObjectID} = require('./db/mongoose');

// Models
var {Todo} = require('./models/todo.model');
var {User} = require('./models/user.model');


var app = express();
var port = 3000;

app.use(bodyParser.json());

// Create resource (POST, JSON with Todo Info);
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

// Get all todos (GET, return array of JSON with Todos)
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }, (err) => {
        res.status(400).send(err);
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
        
        res.status(200).send(todo);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.listen(port, () => console.log(`Express Server started at port ${port}`));

module.exports = {
    app
};

var express = require('express');
var bodyParser = require('body-parser');

// Mongoose config
var {mongoose} = require('./db/mongoose');

// Models
var {Todo} = require('./models/todo.model');
var {User} = require('./models/user.model');


var app = express();
var port = 3000;

app.use(bodyParser.json());

// Create resource (POST, JSON with Todo Info);
app.post('/todos', (req, res) => {
    console.log('Create Todo post petition: ' + req.body);
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        console.log(`Succesfully saved Todo task: ${doc}`);
        res.send(doc);
    }, (err) => {
        console.log(`Error saving todo task: ${err}`);
        res.status(400).send(err);
    });
});

// Get all todos (GET, return array of JSON with Todos)

app.listen(port, () => console.log(`Express Server started at port ${port}`));

const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

var { Todo } = require('../../models/todo.model');
var { User } = require('../../models/user.model');

const todos = [{ 
    _id: new ObjectID(), 
    text: 'First test Todo' },
{ 
    _id: new ObjectID(), 
    text: 'Second test Todo', 
    completed: true, 
    completedAt: new Date().getTime()
}];

var userOneId = new ObjectID();
var userTwoID = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'jmblanco@gmail.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
},
{
    _id: userTwoID,
    email: 'vishop@gmail.com',
    password: 'userTwoPass'
}];

const populateTodos = (done) => {
    Todo.remove().then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove().then(() => {
        var userPromises = [];
        users.forEach(user => {
            userPromises.push(new User(user).save());
        });

        return Promise.all(userPromises);
    }).then(() => done()).catch((err) => done());
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};
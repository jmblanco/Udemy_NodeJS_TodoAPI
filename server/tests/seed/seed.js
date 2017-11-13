const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

var { Todo } = require('../../models/todo.model');
var { User } = require('../../models/user.model');



var userOneId = new ObjectID();
var userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'jmblanco@gmail.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
},
{
    _id: userTwoId,
    email: 'vishop@gmail.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

const todos = [{ 
    _id: new ObjectID(), 
    text: 'First test Todo',
    _creator: userOneId
},
{ 
    _id: new ObjectID(), 
    text: 'Second test Todo', 
    completed: true, 
    completedAt: new Date().getTime(),
    _creator: userTwoId
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
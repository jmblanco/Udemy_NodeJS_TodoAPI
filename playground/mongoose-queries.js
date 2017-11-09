const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo.model');
const {User} = require('../server/models/user.model');

//var id = '5a0451b449494a12bdac4149';
var id = '6a0451b449494a12bdac4149';

if(!ObjectID.isValid(id)){
    console.log('ID not valid');
}
Todo.find({
    _id: id
}).then((todos) =>{
    console.log('Todos: ', todos );
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo: ', todo);
});

Todo.findById(id).then((todo) => {
    if(!todo){
        return console.log('Id not found');
    }
    console.log('Todo by Id: ', todo);
}).catch((err) => console.log(err));

var userId = '5a0461592a486a170f777e87';

User.findById(userId).then((user) => {
    if(!user){
        return console.log('User Id not found');
    }

    console.log('User by Id: ', JSON.stringify(user, undefined, 2));
}).catch((err) => console.log(err));

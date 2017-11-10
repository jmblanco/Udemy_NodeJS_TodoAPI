const {mongoose, ObjectID} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo.model');
const {User} = require('../server/models/user.model');

// // Todo.remove (all)
// Todo.remove({}).then((res) => {
//     console.log(res);
// });


var id = '5a0469c40b7ad721b0572ece';

// Todo.findOneAndRemove (first document that match)
Todo.findOneAndRemove({_id: id}).then((res) => {
    console.log(res);
});

// Todo.findByIdAndRemove (document that id match)
Todo.findByIdAndRemove(id).then((res) => {
    console.log(res);
});
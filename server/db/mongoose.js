var mongoose = require('mongoose');
const {ObjectID} = require('mongodb');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', { useMongoClient: true });

module.exports = {
    mongoose,
    ObjectID
};
var mongoose = require('mongoose');
const {ObjectID} = require('mongodb');

var mongoDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp';
mongoose.Promise = global.Promise;

mongoose.connect(mongoDB, { useMongoClient: true });

module.exports = {
    mongoose,
    ObjectID
};
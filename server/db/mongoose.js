var mongoose = require('mongoose');
const {ObjectID} = require('mongodb');

var mongoDB = process.env.MONGODB_URI;
mongoose.Promise = global.Promise;

mongoose.connect(mongoDB, { useMongoClient: true });

module.exports = {
    mongoose,
    ObjectID
};
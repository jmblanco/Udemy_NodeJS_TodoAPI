// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        console.log(`Unable to connect to MongoDB: ${err}`);
        return;
    }
    console.log('Connected to MongoDB server');

    db.collection('Todos').findOneAndUpdate(
        // {text: 'Eat lunch'}, // Filter
        { _id: new ObjectID('59ff1bab72ede5f9152a75c1') }, // Filter
        { 
            $set: {completed: true }
        }, //Update operators
        {
            returnOriginal: false
        } // Options
    ).then((result) => {
        console.log(result);
    }, (err) => console.log(err));
    //db.close();

    //Task: Update the name to Jose of document with id (59ff12af156cd804815e7f64) in Users and increment the age by one
    db.collection('Users').findOneAndUpdate(
        { _id: new ObjectID('59ff12af156cd804815e7f64')},
        {
            $set: {name: 'Jose'},
            $inc: {age: 1}
        },
        { returnOriginal: false}
    ).then((result) => {
        console.log(result);
    }, (err) => console.log(err));});
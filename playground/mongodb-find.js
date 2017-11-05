// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        console.log(`Unable to connect to MongoDB: ${err}`);
        return;
    }
    console.log('Connected to MongoDB server');

    // Fech ALL!!
    db.collection('Todos').find() //Fech All
        .toArray() //Convert the documento to array
        .then((docs) => {
            console.log(`All TODOs`);
            console.log(JSON.stringify(docs, undefined, 2));
        }, (err) => console.log(`Error feching TODOs Tasks: ${err}`));

    // Fech completed TODOs
    db.collection('Todos').find({ completed: false }) // Fech only completed documents
        .toArray() //Convert the documento to array
        .then((docs) => {
            console.log(`Completed TODOs`);
            console.log(JSON.stringify(docs, undefined, 2));
        }, (err) => console.log(`Error feching TODOs Tasks: ${err}`));

    // Fech document by ID
    db.collection('Todos').find({ 
        _id: new ObjectID('59ff144372ede5f9152a7347')
    }) // Fech document by id
        .toArray() //Convert the documento to array
        .then((docs) => {
            console.log(`TODOs with ID[59ff144372ede5f9152a7347]`);
            console.log(JSON.stringify(docs, undefined, 2));
        }, (err) => console.log(`Error feching TODOs Tasks: ${err}`));

    // Count documents
    db.collection('Todos').find()
    .count()
    .then((count) => {
        console.log(`Number of TODOS task in DB: ${count}`);
    }, (err) => console.log(`Error feching TODOs Tasks: ${err}`));

    // Task: Search in Users, those whos name was Jose
    db.collection('Users').find({ name: 'Jose' }) // Fech only documents witch name = 'Jose'
    .toArray() //Convert the documento to array
    .then((docs) => {
        console.log(`Users with name Jose`);
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => console.log(`Error feching TODOs Tasks: ${err}`));
    //db.close();
});
// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        console.log(`Unable to connect to MongoDB: ${err}`);
        return;
    }
    console.log('Connected to MongoDB server');

    // Delete many
    var deleteMany = false;
    if (deleteMany) {
        db.collection('Todos').deleteMany({ text: 'Eat lunch' }).then((result) => {
            console.log(result);
        });
    }


    // Delete one
    var deleteOne = false;
    if (deleteOne) {
        db.collection('Todos').deleteOne({ text: 'Eat lunch' }).then((result) => {
            console.log(result);
        });
    }

    // Find one and delete
    var findOneAndDelete = false;
    if (findOneAndDelete) {
        db.collection('Todos').findOneAndDelete({ completed: false }).then((result) => {
            console.log(result);
        });
    }


    // Task:
    // 1º: Delete all registers in users with name Jose
    var executeDeleteFirstTask = false;
    if (executeDeleteFirstTask) {
        db.collection('Users').deleteMany({ name: 'Jose' }).then((result) => {
            console.log(result);
        });
    }
    // 2º: Delete user with ID: 59ff129b08772f046dea6275
    var executeDeleteSecondTask = true;
    if (executeDeleteSecondTask) {
        db.collection('Users').findOneAndDelete({ _id: new ObjectID('59ff129b08772f046dea6275') }).then((result) => {
            console.log(result);
        });
    }
    //db.close();
});
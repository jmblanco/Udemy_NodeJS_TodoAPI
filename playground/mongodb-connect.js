// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var user = {name: 'Jose', age: 31};
// //Obtencion de valor por destructoracion del objecto
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        console.log(`Unable to connect to MongoDB: ${err}`);
        return;
    }
    console.log('Connected to MongoDB server');
    
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         console.log(`Unable to inser TODO task: ${err}`);
    //         return;
    //     }
        
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // Insert new doc into Users(name, age,location)
    // db.collection('Users').insertOne({
    //     name: 'Jose',
    //     age: 31,
    //     location: 'Madrid'
    // }, (err, result) => {
    //     if (err) {
    //         console.log(`Unable to insert User: ${err}`);
    //         return;
    //     }
        
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // });
    db.close();
});
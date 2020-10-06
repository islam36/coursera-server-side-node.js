const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations.js');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

mongoClient.connect(url, (err,client) => {
    
    assert.equal(err,null);

    console.log('Connected correctly to the server');

    const db = client.db(dbname);
    dboper.insertDocument(db, { name: "donut", description:"test" }, "dishes", (result) => {
        console.log('insert document:\n' , result.ops);


        dboper.findDocuments(db, 'dihses', (docs) => {
            console.log('found documents:\n', docs);

            dboper.updateDocument(db, { name:'donut'} , { description:'updated test'} , 'dishes' , (result) =>{
                console.log('updated document:\n' , result.result);

                
                dboper.findDocuments(db, 'dihses', (docs) => {
                    console.log('found documents:\n', docs);

                    db.dropCollection('dishes', (result) =>{
                        console.log('dropped collection' , result);

                        client.close();
                    });
                });
            });
        });
    }); 
});
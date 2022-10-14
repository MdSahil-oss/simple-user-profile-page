const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
require('dotenv').config();

const app = express();
const hostname = "http://localhost"
const port = 3000;
const mongoURL = process.env.DATABASE_URL


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))

// Only used when app is run locally on the system otherwhise use `mongoUrlDocker` when running app as docker image
let mongoUrlLocal = "mongodb://admin:password@localhost:27017";

// use when starting application as docker container
let mongoUrlDocker = "mongodb://admin:password@mongodb";

// pass these options to mongo client connect request to avoid DeprecationWarning for current Server Discovery and Monitoring engine
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// "user-account" in demo with docker. "my-db" in demo with docker-compose
let databaseName = "simple-user-profile-page-database";



app.get('/api/getData', (req, res) => {
    let response = {};
    // Connect to the db
    MongoClient.connect(mongoUrlDocker, mongoClientOptions, function (err, client) {
        if (err) throw err;

        let db = client.db(databaseName);
        console.log("Database has been connected")
        let myquery = { userid: 1 };

        db.collection("users").findOne(myquery, function (err, result) {
            if (err) throw err;
            response = result;
            client.close();

            // Send response
            res.send(response ? response : {});
        });
    });

})

app.patch('/api/updateData', (req, res) => {
    let userObj = req.body;

    MongoClient.connect(mongoUrlDocker, mongoClientOptions, function (err, client) {
      if (err) throw err;
  
      let db = client.db(databaseName);
      userObj['userid'] = 1;
  
      let myquery = { userid: 1 };
      let newvalues = { $set: userObj };
  
      db.collection("users").updateOne(myquery, newvalues, {upsert: true}, function(err, res) {
        if (err) throw err;
        client.close();
      });
  
    });
    // Send response
    res.send(userObj);
  
})

app.listen(port, () => {
    console.log(`Server is running on the host:-> ${hostname}:${port}`);
})
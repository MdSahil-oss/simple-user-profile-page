const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
require('dotenv').config();

const app = express();
const hostname = "http://localhost"
const port = 3000;
let mongoUrlDocker = process.env.DATABASE_URL

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))

// Uncomment when monogo is run locally on the system otherwhise leave it commented out 
// ************************************CODE**********************************************
// mongoUrlDocker = "mongodb://admin:password@localhost:27017";
// ************************************CODE END**********************************************


// Uncomment when secret has to be fetched from Vault secret manager.
// **********************************************CODE*********************************************
// // Stored credentials are: `username` & `password`
// // key-value secret engine version is `v1`
// let mountPath = 'mongo'
// let secretName = 'mongo'
// let vaultToken = 'hvs.qsX3We7dSyp8eiVFujSAkT0K'
// let vaultAddr = 'http://localhost:8200'

// function getCred() {
//     fetch(`${vaultAddr}/${'v1'}/${mountPath}/${secretName}`, {
//         method: "GET",
//         headers: {
//             "X-Vault-Request": "true",
//             "X-Vault-Token": vaultToken
//         },
//     }).then((res) => {
//         return res.json()
//     }).then((resJson) => {
//         const username = resJson["data"]["username"];
//         const  password = resJson["data"]["password"];
//         // mongoUrlDocker = `mongodb://${username}:${password}@localhost:27017`;
//         mongoUrlDocker = `mongodb://${username}:${password}@mongodb:27017`;
//     }).catch(err => {
//         console.error(err);
//     });
// }
// getCred();
// ******************************************CODE END**********************************************

// use when starting application as docker container
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

        db.collection("users").updateOne(myquery, newvalues, { upsert: true }, function (err, res) {
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

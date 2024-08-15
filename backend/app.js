const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
// const config = require('./config');
const app = express();
const routes = require('./routes');

var devDatabaseUrl;
var prodDatabaseUrl
let config;

try {
  config = require('./config.js');
//devDatabaseUrl = config.database.dev_connectionString;
//prodDatabaseUrl = config.database.prod_connectionString;
} catch (error) {

  console.error('Error loading config file:', error.message);
  config = {
    database: {
        prod_connectionString: 'nope',
        dev_connectionString: 'nope',
      },
  };
}

let env = process.env.NODE_ENV
env = env.trim();
if(env === `production`){
    databaseUrl = process.env.PROD_DATABASE_URL || config.database.prod_connectionString;
}else{
    databaseUrl = process.env.DEV_DATABASE_URL  || config.database.dev_connectionString;
}

mongoose.connect(databaseUrl)
.then(() => {
    console.log('Connected to database!');
})
.catch(() => {
    console.log('Connection to database failed');
});

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes);

module.exports = app;
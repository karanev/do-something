var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

var config = require('./config');
mongoose.connect(config.database, {useMongoClient : true});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize routes
app.use("/api", require("./app/routes/api"));

app.get('/', function(req, res) {
	res.send('The api is located at /api');
});

app.listen(process.env.port || 1337);
console.log('Listening on port 1337');
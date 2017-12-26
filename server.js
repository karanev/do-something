var express = require('express');
var app = express();

app.get('/', function(req, res) {
	res.send('The api is located at /api');
});

app.listen(1337);
console.log('Listening on port 1337');
var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var mongoose = require('mongoose');
var mongoUri = 'mongodb://localhost/rest-api';
mongoose.connect(mongoUri);

app.use(bodyParser.json());
app.use(express.static('static'))

var pirateModels = require('./models/pirate.model'); 
var routes = require('./my_modules/pirate.routes');
var appRoutes = routes(app);

app.listen(3001);
console.log('Server running at http://localhost:3001/');

var path = require('path');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

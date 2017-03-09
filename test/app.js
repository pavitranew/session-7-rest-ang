var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var mongoose = require('mongoose');
var mongoUri = 'mongodb://localhost/rest-api';
mongoose.connect(mongoUri);


var pirateModels = require('./models/pirate.model'); 
var routes = require('./my_modules/pirate.routes');
var appRoutes = routes(app);

app.use(bodyParser.json());

app.listen(3001);
console.log('Server running at http://localhost:3001/');

app.get('/', function (req, res) {
    res.send('Ahoy there\n');
    console.dir(res);
});

app.get('/pirate/:name', function(req, res) {
   console.log(req.params.name)
});


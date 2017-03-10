const express = require('express');
const app = express();
const bodyParser = require('body-parser')

const mongoose = require('mongoose');
const mongoUri = 'mongodb://localhost/rest-api';
mongoose.connect(mongoUri);

// make sure this line is always before the routes
app.use(bodyParser.json());

const pirateModels = require('./models/pirate.model'); 
const routes = require('./my_modules/pirate.routes');
const appRoutes = routes(app);

app.listen(3001);
console.log('Server running at http://localhost:3001/');

app.get('/', function (req, res) {
    res.send('Ahoy there\n');
    console.dir(res);
});

app.get('/pirate/:name', function(req, res) {
   console.log(req.params.name)
});
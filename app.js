const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const app = express();
const port = 3002;

app.use(bodyParser.urlencoded({
  extended: true
}));
// app.use(bodyParser.json());

app.use(express.static('app'))

const recipeModels = require('./src/recipe.model');
const routes = require('./src/recipe.routes');
const appRoutes = routes(app);

const mongoUri = 'mongodb://devereld:dd2345@ds015730.mlab.com:15730/recipes-dd';

mongoose.connect(mongoUri)

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.listen(port);
console.log('Server running at http://localhost:3002/');

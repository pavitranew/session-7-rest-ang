const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

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

app.listen(3002);
console.log('Server running at http://localhost:3002/');
// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/index.html')
// })

// app.post('/', function (req, res) {
// console.log(req.body)
// res.send('Username: ' + req.body.username);
// })

// app.post('/api/recipes', (req, res) => {

//   console.log(req.body);

//   res.redirect('/');
//   // db.collection('recipes').save(req.body, (err, result) => {
//   //   if (err) return console.log(err);
//   //   console.log('saved to database');
//   //   res.redirect('/');
//   // });
// })



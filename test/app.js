var express = require('express');
var app = express();

app.listen(3001);
console.log('Server running at http://localhost:3001/');

app.get('/', function (req, res) {
    res.send('Ahoy there\n');
    console.dir(res);
});

app.get('/pirate/:name', function(req, res) {
   res.send('{"id": 1,"name":"Matt", "vessel":"HMS Brawler"}');
});
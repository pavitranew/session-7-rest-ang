#MEAN Session Seven

##Homework
- create a form for adding a pirate and create a controller that works to create a new pirate
- send me a link to the github repo

##Building a Rest API

Building a URL route scheme to map requests to app actions.

In a new `rest-api` directory:

`$ npm init`

##Setup Tooling and npm Installs

A joke:

"I went to an all night JavaScript hackathon and by morning we finally had the build process configured!"

###1. Mongo

Run `mongod` in another Terminal tab (if it's not running already). 

If you need help setting the permissions on the db folder [see this post](http://stackoverflow.com/questions/28987347/setting-read-write-permissions-on-mongodb-folder).

###2. Mongoose.js

A [Mongo Driver](http://mongoosejs.com) to model your application data.

Use NPM to install this dependency and update your package.json file.

`npm install mongoose --save-dev`

[Quickstart guide](http://mongoosejs.com/docs/) for Mongoose.

###3. Body Parser

[Body Parser](https://www.npmjs.com/package/body-parser) parses and places incoming requests in a `req.body` property so our handlers can use them.

`npm install body-parser --save-dev`

###4. Nodemon

Install nodemon globally:

`sudo npm install -g nodemon`

or locally

`sudo npm install --save-dev nodemon`

###5. Express

`$ npm install --save express`

Create an npm script for nodemon (npm run server)

```
"scripts": {
    "server": "nodemon index.js"
},
```

Create index.js for express:

```
var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var mongoose = require('mongoose');
var mongoUri = 'mongodb://localhost/rest-api';
mongoose.connect(mongoUri);

app.get('/', function (req, res) {
    res.send('Ahoy there\n');
    console.dir(res);
});

app.listen(3001);
console.log('Server running at http://localhost:3001/');
```

##API Routes

###GET

app.get is our test route to make sure everything is running correctly.

The URL path is the root of the site, the handling method is an anonymous function, and the response is plain text.

Run the app using `npm run server`.

Make a change to res.send in index.js to check that the server restarts. 

Refresh the browser and note the res (response) object being dumped into the console.

(Keep an eye on the nodemon process during this exercise to see if it is hanging.)

###URL Parameters

Add a second route:

```
app.get('/pirate/:name', function(req, res) {
   console.log(req.params.name)
});
```

And run `http://localhost:3001/pirate/matt` noting the console's output.


###Other Routes and Modules

Predefined URL paths your API responds to. Think of each Route as listening to three parts:

* A specific HTTP Action
* A specific URL path
* A handler method

Add routes.js to `/my_modules/pirate.routes.js`. (Note: many people use src as the name of the folder instead of my_modules by convention.)

```js
var pirates = require('../controllers/pirate.controllers');

var pirateRoutes = function(app) {
    app.get('/api/pirates', pirates.findAll);
    app.get('/api/pirates/:id', pirates.findById);
    app.post('/api/pirates', pirates.add);
    app.put('/api/pirates/:id', pirates.update);
    app.delete('/api/pirates/:id', pirates.delete);
    app.get('/api/import', pirates.import);
}

module.exports = pirateRoutes;
```

Note: `module.exports` is the object that's returned as the result of a require call.

All the main elements of a [REST application](http://www.restapitutorial.com/lessons/httpmethods.html) - GET, POST, PUT, DELETE - http actions are accounted for here. We've modeled our URL routes off of REST API conventions, and named our handling methods clearly - prefixing them with `api/` in order to differentiate them from routes we create within Angular.

Note the require statement. We'll create a pirates controller and placed all our Request event handling methods inside the it. 

###Controllers

Create a folder called controllers at the top level. 

Create a new file inside of that called `pirate.controllers.js`. We'll add each request handling method for pirates data to this file one by one. For now add these placeholders to pirates.js so we can restart the server without errors:

```js
exports.findAll = function () { };
exports.findById = function () { };
exports.add = function () { };
exports.update = function () { };
exports.delete = function () { };
```

Check if its working. 

Update findAll's definition in the controllers to a json snippet:

```js
exports.findAll = function(req, res){
	res.send([{
		"id": 1,
		"name": "Max",
		"vessel": "HMS Booty",
		"weapon": "sword"
	}]);
};
```

Update server.js to require our routes file. The .js file extension can be omitted.

```js
var express = require('express');
...
var routes = require('./my_modules/pirate.routes');
var appRoutes = routes(app);

app.listen...
```

Navigate to `localhost:3001/api/pirates`


###Update index.js:

```js
var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var mongoose = require('mongoose');
var mongoUri = 'mongodb://localhost/rest-api';
mongoose.connect(mongoUri);

// make sure this line is always before the routes
app.use(bodyParser.json());

var pirateModels = require('./models/pirate.model'); 
var routes = require('./my_modules/pirate.routes');
var appRoutes = routes(app);

app.listen(3001);
console.log('Server running at http://localhost:3001/');

app.get('/', function (req, res) {
    res.send('Ahoy there\n');
    console.dir(res);
});

app.get('/pirate/:name', function(req, res) {
   console.log(req.params.name)
});
```

- We're requiring the Mongoose module which will communicate with Mongo for us. 

- The mongoUri is a location to the Mongo DB that Mongoose will create if there is not one there already. 

- We added an error handler there to help debug issues connecting to Mongo collections. 

- We configured Express with `app.use(bodyParser.json())` to parse requests' bodies (we'll use that for POST requests).

- Lastly, we require the pirate model which we'll make next.


###Define Data Models

Create a new folder called models and add a new file `pirate.model.js` for our Pirate Model.

Require Mongoose into this file, and create a new Schema object:

```js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PirateSchema = new Schema({
    name: String,
    vessel: String,
    weapon: String
});

module.exports = mongoose.model('Pirate', PirateSchema);
```

This schema makes sure we're getting and setting well-formed data to and from the Mongo collection. Our schema has three String properties which define a Pirate object. 
 
The last line creates and exports the Pirate model object, with built in Mongo interfacing methods. We'll refer to this Pirate object in other files.
 
Ensure that `var pirateModels = require('./models/pirate.model');` is in index.js

Update `controllers/pirate.controllers.js` to require Mongoose, so we can create an instance of our Pirate model to work with. 

And update findAll() to query Mongo with the find() data model method.

```js
const mongoose = require('mongoose');
const Pirate = mongoose.model('Pirate');

exports.findAll = function (req, res) {
    Pirate.find({}, function (err, results) {
        return res.send(results);
    });
};
exports.findById = function () { };
exports.add = function () { };
exports.update = function () { };
exports.delete = function () { };
```

You may recognize find() as a mongo command. 

Passing find() {} means we are not filtering data by any of its properties and so to return all of it. 

Once Mongoose looks up the data it returns an error message and a result set. Use res.send() to return the raw results.

###Start Mongoose

Check the server and then visit the API endpoint for all pirates `localhost:3001/api/pirates`. You'll get JSON data back, in the form of an empty array.

###Importing Data

Manually using mongo CLI:

```
$ mongo
> show dbs
> use rest-api
> db.createCollection('pirates')
> show collections
> db.pirates.insert( { "name": "First Last", "vessel": "The Calico", "weapon": "Peg Leg" } )
> db.pirates.find()
```

Rather than use the Mongo command-line to insert entries into our collection, let's import pirate data with our REST API. Add a new route endpoint to `pirate.routes.js`:

```js
app.get('/api/import', pirates.import);
```

Now define the import method in our controller `controllers/pirate.controller.js`:

```js
exports.import = function (req, res) {
    Pirate.create(
        { "name": "William Kidd", "vessel": "Adventure Galley", "weapon": "Sword" },
        { "name": "Samuel Bellamy", "vessel": "Whydah", "weapon": "Cannon" },
        { "name": "Mary Read", "vessel": "Rackham", "weapon": "Knife" },
        { "name": "John Rackham", "vessel": "The Calico", "weapon": "Peg Leg" }
        , function (err) {
            if (err) return console.log(err);
            return res.send(202);
        });
};
```

This import method adds four items from the JSON to a pirates collection. The Pirate model is referenced here to call its create method. create() takes one or more documents in JSON form, and a callback to run on completion. If an error occurs, Terminal will return the error and the request will timeout in the browser. On success, the 202 "Accepted" HTTP status code is returned to the browser. Restart your node server and visit this new endpoint to import data.

`localhost:3001/api/import/`

###Returning Data

Now visit the `http://localhost:3001/api/pirates` endpoint to view the new pirates data. You'll see an array of JSON objects, each in the defined schema, with an additional generated unique private _id and internal __v version key. 

####Find By id

Recall our route for getting a pirate by its id: `app.get('/pirates/:id', pirates.findById)`. 

Add the handler method:

```js
exports.findById = function (req, res) {
    const id = req.params.id;
    Pirate.findOne({ '_id': id }, function (err, result) {
        return res.send(result);
    });
};
```

This route's path uses a parameter pattern for id `/pirates/:id` which we can refer to in `req`. Pass this id to Mongoose to look up and return just one document.

At your find all endpoint `http://localhost:3001/api/pirates`, copy one of the ids, paste it in at the end of the current url in the browser and refresh. You'll get a single JSON object for that one pirate's document.

e.g. `http://localhost:3001/api/pirates/58c0d373d6f9c124b7f768b5`

###Postman

Since modelling endpoints is a common task and is rendered difficult by the opaqueness of the http verbs most people use a utility such as [Postman](https://www.getpostman.com/). 

####Add a Pirate

We used create() for our import function to add multiple documents to our Pirates Mongo collection. Our POST handler uses the same method to add a single Pirate to the collection. Once added, the response is the full new Pirate's JSON object.

```js
exports.add = function (req, res) {
    Pirate.create(req.body, function (err, pirate) {
        if (err) return console.log(err);
        return res.send(pirate);
    });
}
```

Use cURL to POST to the add endpoint with the full Pirate JSON as the request body (making sure to check the URL port and path).

```
$ curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "Jean Lafitte", "vessel": "Barataria Bay", "weapon":"curses"}' http://localhost:3001/api/pirates
```

We will also create a new Pirate in Postman.

![Image of chart](https://github.com/mean-fall-2016/session-8/blob/master/assets/img/postman2.png)

Refresh `http://localhost:3001/pirates` to see the new entry at the end.

####Delete

Our next REST endpoint, delete, reuses what we've done above. Add this to controllers/pirates.js.

```js
exports.delete = function (req, res) {
    var id = req.params.id;
    Pirate.remove({ '_id': id }, function (result) {
        return res.send(result);
    });
};
```

Restart, and check it out with:

```
$ curl -i -X DELETE http://localhost:3001/pirates/5820d3584dc4674967d091e6
```

Create and test a delete Pirate action in Postman.

####Update a Pirate

PUT HTTP actions in a REST API correlate to an Update method. The route for Update also uses an :id parameter.

```js
exports.update = function (req, res) {
    const id = req.params.id;
    const updates = req.body;

    Pirate.update({ "_id": id }, req.body,
        function (err, numberAffected) {
            if (err) return console.log(err);
            console.log('Updated %d pirates', numberAffected);
            return res.sendStatus(202);
        });
};
```

Notice the updates variable storing the req.body. req.body is useful when you want to pass in larger chunks of data such as a single JSON object. Here we will pass in a JSON object (following the schema) of only the model's properties you want to change.

The model's update() takes three parameters:

* JSON object of matching properties to look up the doc with to update
* JSON object of just the properties to update
* callback function that returns the number of documents updated

###Curl

PUT actions are difficult to test in the browser, so we use cURL in Terminal and Postman.

We will need to construct this line using ids from the pirates listing and test it in a new Terminal tab. Edit the URL to reflect both the port and id of the target pirate:

```
$ curl -i -X PUT -H 'Content-Type: application/json' -d '{"vessel": "Big Vessel"}' http://localhost:3001/api/pirates/5820ce6379cc204557b40a21
```

#AAARGH - this stopped working

This sends a JSON Content-Type PUT request to our update endpoint. That JSON object is the request body, and the long hash at the end of the URL is the id of the pirate we want to update. 

Terminal will output a JSON object of the response to the cURL request and Updated 1 pirates from our callback function.

Visit the same URL from the cURL request in the browser to see the changes.

We'll use Postman to run through the process of editing a pirate above.

Remember to set the body to `raw` and the `text` header to application/json

post
http://localhost:3001/api/pirates/
{"name": "Donald Trump", "vessel": "Trump's Junk", "weapon":"Twitter"}

![Image of chart](https://github.com/mean-fall-2016/session-8/blob/master/assets/img/postman.png)

##Building a Front End for Our API

Add a layouts directory and into it `index.html`:

```html
<!DOCTYPE html>
<html>

<head>
	<title>AngularJS Pirates</title>
	<script src="https://code.angularjs.org/1.6.2/angular.js"></script>
	<script src="https://code.angularjs.org/1.6.2/angular-route.js"></script>
	<script src="https://code.angularjs.org/1.6.2/angular-animate.js"></script>
	<script src="/js/app.js"></script>
</head>

<body>
	<h1>test</h1>
</body>
</html>
```

Note - this page is unavaiable (even if it is in the root directory).

Add/edit this route to server.js:

```js
app.get('/', function(req, res) {
    res.sendfile('./layouts/index.html')
})
```

Note - `express deprecated res.sendfile: Use res.sendFile instead`

```
var path = require('path');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/layouts/index.html'));
});
```

Create css, js, and img folders in static or reuse the assets material.

Populate the js folder with app.js:

```js
angular.module('pirateApp', []);
```

Now we can access the page at localhost://300X however the we need to configure a static assets directory.

Add a static directory for our assets to server.js

`app.use(express.static('static'))`

Add a ngApp:

```html
<!DOCTYPE html>
<html ng-app='pirateApp'>

<head>
	<title>AngularJS Pirates</title>
	<link rel="stylesheet" href="css/styles.css">
	<script src="https://code.angularjs.org/1.6.2/angular.js"></script>
	<script src="https://code.angularjs.org/1.6.2/angular-route.js"></script>
	<script src="https://code.angularjs.org/1.6.2/angular-animate.js"></script>
	<script src="/js/app.js"></script>
</head>

<body>
	<h1>test</h1>
</body>
</html>
```

Let's run a simple test by pulling in data from our API.

```js
angular.module('pirateApp', [])
    .controller('PirateAppController', function ($scope, $http) {
        $http.get('/api/pirates').
            then(function (response) {
                $scope.pirates = response.data;
                console.log($scope.pirates);
            });
    });
```


```html
<body ng-controller="PirateAppController">
	<h1>Pirates</h1>
	<ul>
		<li ng-repeat="pirate in pirates">
			{{ pirate.name }}
			<span>X</span>
		</li>
	</ul>
</body>
```

###Deleting a Pirate

As a starting point reuse the array script. Recall the script from a previous lesson:

```
$scope.deletePirate = function(index) {
	$scope.pirates.splice(index, 1);
}
```

Wire up the deletePirate function:

```
<ul>
	<li ng-repeat="pirate in pirates">
		{{ pirate.name }} | {{ pirate._id }}
		<span ng-click="deletePirate(pirate._id)">X</span>
	</li>
</ul>
```

```
$scope.deletePirate = function(pid) {
	$http.delete('/api/pirates/' + pid);
}
```

But this has no effect on the view ($scope)

```
$scope.deletePirate = function (index, pid) {
    console.log(pid);
    $http.delete('/api/pirates/' + pid)
    .then( () => $scope.pirates.splice(index, 1))
}
```

```
<ul>
	<li ng-repeat="pirate in pirates">
		{{ pirate.name }} {{ pirate._id }}
		<span ng-click="deletePirate($index, pirate._id)">X</span>
	</li>
</ul>
```

##Notes

https://www.mongodb.com/blog/post/building-your-first-application-mongodb-creating-rest-api-using-mean-stack-part-1




##Visualisation

![Image of chart](https://github.com/mean-fall-2016/session-7/blob/master/viz.png)

```
var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
```

The homepage index.html will not load. 

```
var express = require('express')
var app = express()

var path = require('path');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3008, function () {
  console.log('Example app listening on port 3008!')
})
```


```html
<div ng-app="graphApp" ng-controller="graphController">
	<div class="chart" style="width:{{width}}px; height:{{height}}px;">
		<div class="y" style="width:{{height}}px;">{{yAxis}}</div>
		<div class="x">{{xAxis}}</div>
	</div>
</div>
```

```js
var app = angular.module('graphApp', []);
app.controller('graphController', function($scope){

	$scope.width = 600;
	$scope.height = 400;
	$scope.yAxis = "Booty Haul";
	$scope.xAxis = "2015";	
});
```

app.js will not be read.

`https://expressjs.com/en/starter/static-files.html`

```
app.use(express.static('css'));
app.use(express.static('js'));
```

Add some basic css

```css
html {
  background-image: linear-gradient(to bottom, #023e54, #10aac0);
  min-height: 100%;
  height: auto;
  margin: 0; 
}

body {
  font-family: Helvetica, Arial, sans-serif;
  color: #fff;
  margin: 0;
}
.chart { 
	border-left: 2px solid #ddd; 
	border-bottom: 2px solid #ddd;
	margin: 60px auto;
	position: relative;
}
.y {
	position: absolute;
	bottom: 0;
	padding: 6px;
	transform-origin: bottom left;
	transform: rotate(-90deg);
	text-align: center;
}
.x {
	position: absolute;
	bottom: -70px;
	padding: 6px;
	width: 100%;
	text-align: center;
}
```

Take the data from data.js and add it to the controller:

```js
	var app = angular.module('graphApp', []);
	app.controller('graphController', function($scope){

		$scope.width = 600;
		$scope.height = 400;
		$scope.yAxis = "Booty Haul";
		$scope.xAxis = "2015";

		$scope.data = [
		{
			label: 'January',
			value: 36
		},
		{
			label: 'February',
			value: 54
		},
		{
			label: 'March',
			value: 62
		},
		{
			label: 'April',
			value: 82
		},
		{
			label: 'May',
			value: 96
		},
		{
			label: 'June',
			value: 104
		},
		{
			label: 'July',
			value: 122
		},
		{
			label: 'August',
			value: 152
		},
		{
			label: 'September',
			value: 176
		},
		{
			label: 'October',
			value: 180
		},
		{
			label: 'November',
			value: 252
		},
		{
			label: 'December',
			value: 342
		}
		];
	});
```
Add the bar data to the view:

```html
<div class="chart" style="width:{{width}}px; height:{{height}}px;">

<div ng-repeat="bar in data" class="bar" style="height:{{bar.value}}px; width:{{width / data.length - 8 }}px; left:{{$index / data.length * width }}px">
	<span class="value">{{bar.value}}</span>
	<span class="label">{{bar.label}}</span>
</div>
```

Add display for this to the css
```css
.bar {
	background: rgba(146, 84, 164, 0.8);
	position: absolute;
	bottom: 0;
}
.bar:nth-of-type(even) {
	background: rgba(188, 77, 61, 0.8);
}
.value {
	display: inline-block;
	margin-top: 10px;
    	text-align: center;
}
.label {
	position: absolute;
	bottom: -30px;
	font-size: 10px; 
	transform: rotate(30deg);
}
```

Add the array processor for `$scope.max`

```js
	var app = angular.module('graphApp', []);
	app.controller('graphController', function($scope){
		...

		$scope.max = 0;
		var arrLength = $scope.data.length;
		for (var i =0; i < arrLength; i++){
			if($scope.data[i].value > $scope.max){
				$scope.max = $scope.data[i].value;
			}
		}
	});

```

Use it to calculate the max height of the columns in css:

```html
style="height:{{bar.value / max * height }}px; width:{{width / data.length - 8 }}px; left:{{$index / data.length * width }}px"
```




```css
html {
  box-sizing: border-box;
  background-image: -webkit-linear-gradient(top, #023e54, #10aac0);
  min-height: 100%;
  height: auto;
  margin: 0; 
}

body {
  font-family: Helvetica, Arial, sans-serif;
  color: #fff;
  text-align: center;
  margin: 0;
}
.chart { 
	border-left: 2px solid #ddd; 
	border-bottom: 2px solid #ddd;
	margin: 60px auto;
	position: relative;
}
.y {
	position: absolute;
	bottom: 0;
	padding: 6px;
	transform-origin: bottom left;
	transform: rotate(-90deg);
	text-align: center;
}
.x {
	position: absolute;
	bottom: -70px;
	padding: 6px;
	width: 100%;
	text-align: center;
}
.bar {
	background: rgba(146, 84, 164, 0.8);
	position: absolute;
	bottom: 0;
}
.bar:nth-child(even) {
	background: rgba(188, 77, 61, 0.8);
}
.value {
	display: inline-block;
	margin-top: 10px;
}
.label {
	position: absolute;
	bottom: -30px;
	font-size: 10px; 
	transform: rotate(30deg);
}
```







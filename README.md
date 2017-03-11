#MEAN Session Seven

##Homework
- create a form for adding a pirate and create a controller that works to create a new pirate
- send me a link to the github repo

##Building a Rest API

Building a URL route scheme to map requests to app actions.

1 `$ npm init` in the `rest-api` directory:

2 Create an npm script for nodemon (npm run start)

```
"scripts": {
    "start": "nodemon app.js"
},
```

##Setup Tooling and npm Installs

`sudo npm install --save nodemon express mongoose body-parser`

###1. Mongo

Run `mongod` in another Terminal tab (if it's not running already). 

If you need help setting the permissions on the db folder [see this post](http://stackoverflow.com/questions/28987347/setting-read-write-permissions-on-mongodb-folder).

Test it:

```
$ mongo
> show dbs
```

###2. Mongoose.js

We'll use a [Mongo Driver](http://mongoosejs.com) to model application data. Here's the [quickstart guide](http://mongoosejs.com/docs/) for Mongoose.

###3. Body Parser

[Body Parser](https://www.npmjs.com/package/body-parser) parses and places incoming requests in a `req.body` property so our handlers can use them.

###app.js

Create app.js for express:

```js
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

// make sure this line always appears before the routes
app.use(bodyParser.json());

const mongoose = require('mongoose');
const mongoUri = 'mongodb://localhost/rest-api';
mongoose.connect(mongoUri);

app.get('/', function (req, res) {
    res.send('Ahoy there\n');
});

app.listen(3001);
console.log('Server running at http://localhost:3001/');
```

app.get is our test route to make sure everything is running correctly.

The URL path is the root of the site, the handling method is an anonymous function, and the response is plain text.

Run the app using `npm run start`.

Make a change to res.send in app.js to check that the server restarts. (Keep an eye on the nodemon process during this exercise to see if it is hanging.)

##API Routes

###API Routes

An api route is a predefined URL path that our API responds to. 

Add routes.js to `/my_modules/pirate.routes.js`.

```js
var pirates = require('pirate.controllers');

var pirateRoutes = function(app) {
    app.get('/api/pirates', pirates.findAll);
    app.get('/api/pirates/:id', pirates.findById);
    app.post('/api/pirates', pirates.add);
    app.put('/api/pirates/:id', pirates.update);
    app.delete('/api/pirates/:id', pirates.delete);
}

module.exports = pirateRoutes;
```

Think of each Route as listening to three parts:

* A specific HTTP Action (get, post...)
* A specific URL path (/api/piates...)
* A handler method (findAll)

(Note: `module.exports` - the object that's returned as the result of a require call in app.js.)

All the main elements of a [REST application](http://www.restapitutorial.com/lessons/httpmethods.html) - GET, POST, PUT, DELETE - http actions are accounted for here. 

We've modeled our URL routes off of REST API conventions, and named our handling methods clearly - prefixing them with `api/` in order to differentiate them from routes we create within Angular.

Note the require statement. We'll create a pirates controller and placed all our Request event handling methods inside the it. 

###Controllers 

Create a new file inside of `src` called `pirate.controllers.js`. We'll add each request handling method for pirates data to this file one by one. For now add these placeholders to pirates.js so we can restart the server without errors:

```js
exports.findAll = function () { };
exports.findById = function () { };
exports.add = function () { };
exports.update = function () { };
exports.delete = function () { };
```

###Check if its working. 

Update findAll's definition in `pirate.controllers.js` to a json snippet:

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

Update app.js to require our routes file. The .js file extension can be omitted.

```js
const express = require('express');
...
const routes = require('./src/pirate.routes');
const appRoutes = routes(app);

app.listen...
```

Navigate to `localhost:3001/api/pirates`


###Define Data Models

Update  `app.js` with `const pirateModels = require('./models/pirate.model');`

```js
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

const mongoose = require('mongoose');
const mongoUri = 'mongodb://localhost/rest-api';
mongoose.connect(mongoUri);

// make sure this line always appears before the routes
app.use(bodyParser.json());

// NEW
const pirateModels = require('./models/pirate.model'); 

const routes = require('./my_modules/pirate.routes');
const appRoutes = routes(app);

app.listen(3001);
console.log('Server running at http://localhost:3001/');

app.get('/', function (req, res) {
    res.send('Ahoy there\n');
    console.dir(res);
});
```

<!-- - We're requiring the Mongoose module which will communicate with Mongo for us. 

- The mongoUri is a location to the Mongo DB that Mongoose will create if there is not one there already. 

- We added an error handler there to help debug issues connecting to Mongo collections. 

- We configured Express with `app.use(bodyParser.json())` to parse requests' bodies (we'll use that for POST requests).

- Lastly, we require the pirate model which we'll make next. -->

Create a new folder called models and add a new file `pirate.model.js` for our Pirate Model.

Require Mongoose into this file, and create a new Schema object:

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PirateSchema = new Schema({
    name: String,
    vessel: String,
    weapon: String
});

module.exports = mongoose.model('Pirate', PirateSchema);
```

This schema makes sure we're getting and setting well-formed data to and from the Mongo collection. Our schema has three String properties which define a Pirate object. 
 
The last line creates and exports the Pirate model object, with built in Mongo interfacing methods. We'll refer to this Pirate object in other files.

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

###Test Mongoose

Check the server and then visit the API endpoint for all pirates `localhost:3001/api/pirates`. You'll get JSON data back, in the form of an empty array.

###Importing Data

Manually using mongo CLI:

```
$ mongo
> show dbs
> use rest-api
> show collections
> db.createCollection('pirates')
> db.pirates.insert( { "name": "First Last", "vessel": "The Calico", "weapon": "Peg Leg" } )
> db.pirates.find()
```

Rather than use the Mongo command-line to insert entries into our collection, let's import pirate data with our REST API. Add a new route endpoint to `pirate.routes.js`:

```js
app.get('/api/import', pirates.import);
```

Now define the import method in our controller `src/pirate.controller.js`:

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

e.g. `http://localhost:3001/api/pirates/58c30e6e8676587a1dc690fb`

####Add a Pirate

We used create() for our import function to add multiple documents to our Pirates Mongo collection. Our POST handler uses the same method to add a single Pirate to the collection. Once added, the response is the full new Pirate's JSON object.

```js
exports.add = function (req, res) {
    Pirate.create(req.body, function (err, pirate) {
        if (err) return console.log(err);
        return res.send('This is a new pirate ' + pirate);
    });
}
```

Use cURL to POST to the add endpoint with the full Pirate JSON as the request body (making sure to check the URL port and path).

```
$ curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "Jean Lafitte", "vessel": "Barataria Bay", "weapon":"curses"}' http://localhost:3001/api/pirates
```

###Instroducing Postman

Since modelling endpoints is a common task and is rendered difficult by the opaqueness of the http verbs most people use a utility such as [Postman](https://www.getpostman.com/). 

Test a GET in postman with `http://localhost:3001/api/pirates/`

We will create a new Pirate in Postman.

Set Postman to POST, set the URL in Postman to `http://localhost:3001/api/pirates/`

<!-- ![Image of chart](https://github.com/mean-fall-2016/session-8/blob/master/assets/img/postman2.png) -->

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

Check it out with:

```
$ curl -i -X DELETE http://localhost:3001/api/pirates/58c39048b3ddce0348706837
```

Create and test a delete Pirate action in Postman.

##Building a Front End for Our API

Open and examine `index.html`.

Edit this route in `app.js` to send the index file:

```js
app.get('/', function(req, res) {
    res.sendfile('./index.html')
})
```

<!-- Note - `express deprecated res.sendfile: Use res.sendFile instead`

```
var path = require('path');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/layouts/index.html'));
});
``` -->
Note the static folder in today's repo.

Add the static directory for our assets to app.js:

`app.use(express.static('static'))`

Create `angular.module.js`:

```js
angular.module('pirateApp', []);
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
        <li ng-repeat="pirate in pirates"  class="fade">
            {{ pirate.name }}
            <span>X</span>
        </li>
    </ul>
</body>
```

###Deleting a Pirate

Wire up the deletePirate function:

```
<ul>
    <li ng-repeat="pirate in pirates" class="fade">
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

Clicking on an X will remove a pirate but you need to refresh to see the result. 

It has no effect on the view ($scope)

```
$scope.deletePirate = function (index, pid) {
    console.log(pid);
    $http.delete('/api/pirates/' + pid)
    .then( () => $scope.pirates.splice(index, 1))
}
```

```
<ul>
    <li ng-repeat="pirate in pirates" class="fade">
        {{ pirate.name }} {{ pirate._id }}
        <span ng-click="deletePirate($index, pirate._id)">X</span>
    </li>
</ul>
```

###Animation

1 Inject ng-animate:

`const pirateApp = angular.module('pirateApp', ['ngAnimate'])`

2 Add ng-class to the repeated li's 

`ng-class="{ even: $even, odd: $odd }"`

3 Note the class `fade` on the `li`'s and add css:

```
.odd {background: #bada55;}

.fade.ng-enter {
  animation: 2s appear;
}
.fade.ng-leave {
  animation: 0.5s disappear;
}

@keyframes appear {
  from {
    opacity: 0;
    transform: translateX(-200px);
  }
  to {
    opacity: 1;
  }
}
@keyframes disappear {
    0% {
        opacity: 1;
    }
    50% {
        font-size: 1.5rem;
    }
    75% {
        color: green;
    }
    100% {
        opacity: 0;
        transform: translateX(-100%);
    }
}
```



####Update a Pirate

PUT HTTP actions in a REST API correlate to an Update method. The route for Update also uses an :id parameter.

```js
exports.update = function (req, res) {
    const id = req.params.id;
    const updates = req.body;

    Pirate.update({ "_id": id }, req.body,
        function (err) {
            if (err) return console.log(err);
            return res.sendStatus(202);
        });
};
```

Notice the updates variable storing the req.body. req.body is useful when you want to pass in larger chunks of data such as a single JSON object. Here we will pass in a JSON object (following the schema) of only the model's properties you want to change.

The model's update() takes three parameters:

* JSON object of matching properties to look up the doc with to update
* JSON object of just the properties to update
* callback function that returns the number of documents updated

###Test with Curl

We will need to construct this line using ids from the pirates listing and test it in a new Terminal tab. Edit the URL to reflect both the port and id of the target pirate:

```
$ curl -i -X PUT -H 'Content-Type: application/json' -d '{"vessel": "Big Vessel"}' http://localhost:3001/api/pirates/58c2aefddcc6e56c41f96fe8
```

This sends a JSON Content-Type PUT request to our update endpoint. That JSON object is the request body, and the long hash at the end of the URL is the id of the pirate we want to update. 

Visit the same URL from the cURL request in the browser to see the changes.

PUT actions are difficult to test in the browser, so we'll use Postman to run through the process of editing a pirate above.

Set the body to `raw` and the `text` header to application/json

put
http://localhost:3001/api/pirates/< _id >
{"name": "Donald Trump", "vessel": "Trump's Junk", "weapon":"Twitter"}






# MEAN Session Seven 

## Homework
- prepare your midterm - see session 6
- install the [Angular generator](https://github.com/angular/angular-cli) 

On a mac: `sudo npm install -g @angular/cli`

On a PC - run Powershell as Admin and `npm install -g @angular/cli`

## Building a Rest API

Building a URL route scheme to map requests to app actions.

1: `$ npm init -y` in the `rest-api` directory

2: Setup Tooling and npm Installs

`sudo npm install --save nodemon express mongoose body-parser`

3: Create an npm script for nodemon (npm run start)

```js
"scripts": {
    "start": "nodemon app.js"
},
```

4: Add a .gitignore file.

### 1. Mongo

Run `mongod` in another Terminal tab (if it's not running already). 

If you need help setting the permissions on the db folder [see this post](http://stackoverflow.com/questions/28987347/setting-read-write-permissions-on-mongodb-folder).

Test it:

```bash
$ which mongod
$ mongo
> show dbs
```

#### 2. Body Parser

[Body Parser](https://www.npmjs.com/package/body-parser) parses and places incoming requests in a `req.body` property so our handlers can use them.

#### 3. app.js

Create app.js for express:

```js
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

// make sure this line always appears before any routes
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Ahoy there');
});

app.listen(3001);
console.log('Server running at http://localhost:3001/');
```

`app.get` is our test route to make sure everything is running correctly.

The URL path is the root of the site, the handling method is an anonymous function, and the response is plain text.

Run the app using `npm run start`.

Make a change to res.send in app.js to check that the server restarts. (Keep an eye on the nodemon process during this exercise to see if it is hanging.)

## API Routes

An api route is a predefined URL path that our API responds to, e.g.:

```js
app.get('/api/pirates', findAll);

function findAll(req, res){
    res.send(
        [{
            "name": "Max",
            "vessel": "HMS Booty",
            "weapon": "sword"
        }]
        )
};
```

For better organization we will create separate modules for our routes and their associated controllers.

Add routes.js to `/src/pirate.routes.js`.

```js
const pirates = require('./pirate.controllers');

const pirateRoutes = function(app) {
    app.get('/api/pirates', pirates.findAll);
    app.get('/api/pirates/:id', pirates.findById);
    app.post('/api/pirates', pirates.add);
    app.put('/api/pirates/:id', pirates.update);
    app.delete('/api/pirates/:id', pirates.delete);
}

module.exports = pirateRoutes;
```

Each route consists of three parts:

* A specific HTTP Action (get, post...)
* A specific URL path (/api/piates...)
* A handler method (findAll)

(Note: `module.exports` - the object that's returned as the result of a require call in app.js.)

All the main elements of a [REST application](http://www.restapitutorial.com/lessons/httpmethods.html) - GET, POST, PUT, DELETE - http actions are accounted for here. 

We've modeled our URL routes off of REST API conventions, and named our handling methods clearly - prefixing them with `api/` in order to differentiate them from routes we create within Angular.

Note the require statement. We'll create a pirates controller and placed all our Request event handling methods inside the it. 

### Controllers

Create a new file inside of `src` called `pirate.controllers.js`. We'll add each request handling method for pirates data to this file one by one. For now add these placeholders to pirates.js so we can restart the server without errors:

```js
exports.findAll = function () { };
exports.findById = function () { };
exports.add = function () { };
exports.update = function () { };
exports.delete = function () { };
```

### Check if its working.

1: Update `app.js` to require our routes file. The .js file extension can be omitted. `const routes = require('./src/pirate.routes');`

NOTE: we are also creating the appRoutes variable to call the function in pritate.routes: `const pirateRoutes = function(app)`

```js
const app = express();
const bodyParser = require('body-parser')

// make sure this line always appears before any routes
app.use(bodyParser.json());

const routes = require('./src/pirate.routes');
const appRoutes = routes(app);


app.get('/', function (req, res) {
    res.send('Ahoy there');
});

app.listen(3001);
console.log('Server running at http://localhost:3001/');
```

2: Update findAll's definition in `pirate.controllers.js` to a json snippet:

```js
exports.findAll = function(req, res){
    res.send(
        [{
        "name": "Max",
        "vessel": "HMS Booty",
        "weapon": "sword"
        }]
    )
};
```

3: Navigate to the specified route in `app.get('/api/pirates', pirates.findAll);`:

`localhost:3001/api/pirates`

### Define Data Models (Mongoose)

Rather than just using the MongoClient ( e.g. `var mongo = require('mongoDB').MongoClient;`), we will use [Mongoose](http://mongoosejs.com) to model application data. Here's the [quickstart guide](http://mongoosejs.com/docs/) for Mongoose.

Mongoose is built upon the MongoDB driver to provide developers a way to model data.

Using Mongoose requires that we create a model for our data. 

Add a new file `pirate.model.js` to `src` for our Pirate Model.

Require Mongoose in this file, and create a new Schema object:

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

1: Update  `app.js` with

```js
const mongoose = require('mongoose');
const mongoUri = 'mongodb://localhost/rest-api';
// or use an online db e.g.:
// const mongoUri = 'mongodb://deverell:dd2345@ds113746.mlab.com:13746/pirates';
mongoose.connect(mongoUri);
```

=== NOTE
To use an online db simply provide a different connection string:

```js
const mongoUri = 'mongodb://deverell:dd2345@ds113746.mlab.com:13746/pirates';
```

and wrap your `app.get` method in the url:

```js
mongoose.connect(mongoUri, (err, database) => {
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/index.html')
    })
})
```

=== 


and add a reference to our model:
`const pirateModels = require('./src/pirate.model');`

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
const pirateModels = require('./src/pirate.model'); 

const routes = require('./src/pirate.routes');
const appRoutes = routes(app);

app.listen(3001);
console.log('Server running at http://localhost:3001/');

app.get('/', function (req, res) {
    res.send('Ahoy there\n');
});
```

Here is the alternate using mLab:

```js
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

const mongoose = require('mongoose');
// const mongoUri = 'mongodb://localhost/rest-api2';
const mongoUri = 'mongodb://deverell:dd2345@ds113746.mlab.com:13746/pirates';

mongoose.connect(mongoUri);

// make sure this line always appears before the routes
app.use(bodyParser.json());
app.use(express.static('static'))

const pirateModels = require('./src/pirate.model');

const routes = require('./src/pirate.routes');
const appRoutes = routes(app);


mongoose.connect(mongoUri, (err, database) => {
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/index.html')
    })
})


app.listen(3001);

console.log('Server running at http://localhost:3001/');
```

2: Update `src/pirate.controllers.js` to require Mongoose, so we can create an instance of our Pirate model to work with.

```js
const mongoose = require('mongoose');
const Pirate = mongoose.model('Pirate');
```

At the top of the script. e.g.:

```js
const mongoose = require('mongoose');
const Pirate = mongoose.model('Pirate');

exports.findAll = function(req, res){
    res.send(
        [{
        "name": "Max",
        "vessel": "HMS Booty",
        "weapon": "sword"
        }]
    )
};
exports.findById = function () { };
exports.add = function () { };
exports.update = function () { };
exports.delete = function () { };
```

3: pirate.controllers: update findAll() to query Mongo with the find() data model method.

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

`find()` is a [mongoose method](https://docs.mongodb.com/manual/reference/method/js-collection/). Passing `find(){}` means we are not filtering data by any of its properties and so to return all of it. 

Once Mongoose looks up the data it returns a result set. Use res.send() to return the raw results.

Check that the server is still running and then visit the API endpoint for all pirates `localhost:3001/api/pirates`. You'll get JSON data back - an empty array since we have no entries.

### Importing Data

Manually using mongo CLI:

```
$ mongo
> show dbs
> use rest-api
> show collections
> db.createCollection('pirates')
> db.pirates.insert( { "name": "Donald Trump", "vessel": "Trump's Junk", "weapon": "Twitter" } )
> db.pirates.find()
```

Rather than use the Mongo command-line to insert entries into our collection, let's import pirate data with our REST API. Add a new route endpoint to `pirate.routes.js`.

1: Add to `pirate.routes.js`:

```js
app.get('/api/import', pirates.import);
```

e.g.:

```js
const pirates = require('./pirate.controllers');

const pirateRoutes = function(app) {
    app.get('/api/pirates', pirates.findAll);
    app.get('/api/pirates/:id', pirates.findById);
    app.post('/api/pirates', pirates.add);
    app.put('/api/pirates/:id', pirates.update);
    app.delete('/api/pirates/:id', pirates.delete);

    app.get('/api/import', pirates.import);
    
}

module.exports = pirateRoutes;
```

2: define the import method in our controller `pirate.controllers.js`:

```js
exports.import = function (req, res) {
    // Pirate below refers to the mongoose schema. create() is a mongoose method
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

This import method adds four items from the JSON to a pirates collection. The Pirate model is referenced here to call its create method. create() takes one or more documents in JSON form, and a callback to run on completion. If an error occurs, Terminal will return the error and the request will timeout in the browser. On success, the 202 "Accepted" HTTP status code is returned to the browser. 

Visit this new endpoint to import data.

`localhost:3001/api/import/`

Now visit the `http://localhost:3001/api/pirates` endpoint to view the new pirates data. You'll see an array of JSON objects, each in the defined schema, with an additional generated unique private `_id` and internal `__v` version key (added by Mongoose to track changes or revisions). 

#### Find By id

Recall our route for getting an entry by id: `app.get('/pirates/:id', pirates.findById)`. 

Add the handler method:

```js
exports.findById = function (req, res) {
    const id = req.params.id;
    Pirate.findOne({ '_id': id }, function (err, result) {
        return res.send(result);
    });
};
``` 

This route's path uses a parameter pattern for id `/pirates/:id` which we can refer to in `req` to look up and return just one document.

At your findAll endpoint `http://localhost:3001/api/pirates`, copy one of the ids, paste it in at the end of the current url in the browser and refresh. You'll get a single JSON object for that one pirate's document.

e.g. `http://localhost:3001/api/pirates/58c2aefddcc6e56c41f96fe8`

#### Add a Pirate

We used create() for our import function to add multiple documents to our Pirates Mongo collection. Our POST handler uses the same method to add a single Pirate to the collection. Once added, the response is the full new Pirate's JSON object.

```js
exports.add = function (req, res) {
    Pirate.create(req.body, function (err, pirate) {
        if (err) return console.log(err);
        return res.send(pirate);
    });
}
```

In a new tab - use cURL to POST to the add endpoint with the full Pirate JSON as the request body (making sure to check the URL port and path).

```bash
curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "Donald Trump", "vessel": "Trumps Junk", "weapon":"Twitter"}' http://localhost:3001/api/pirates
```

### Introducing Postman

Since modelling endpoints is a common task and few enjoy using curl, most people use a utility such as [Postman](https://www.getpostman.com/). 

Test a GET in postman with `http://localhost:3001/api/pirates/`

#### Create a new Pirate in Postman.

1. Set Postman to POST, set the URL in Postman to `http://localhost:3001/api/pirates/`
1. Choose `raw` and set the text type to JSON(application/json)
1. Set Body to `{ "name":"ooops","vessel":"wow","weapon":"huh?" }`
1. Hit Send

Refresh `http://localhost:3001/pirates` to see the new entry at the end.

#### Delete

Our next REST endpoint, delete, reuses what we've done above. Add this to controllers/pirates.js.

```js
exports.delete = function (req, res) {
    let id = req.params.id;
    Pirate.remove({ '_id': id }, function (result) {
        return res.send(result);
    });
};
```

Check it out with curl (replacing the id at the end of the URL with a known id from you api/pirates endpoint):

```
$ curl -i -X DELETE http://localhost:3001/api/pirates/5a1af3f1a77dff32001d9d24
```

Or by a Delete action in Postman.

1: Set the action to Delete

2: Append an id from the pirates endpoint to the /api/pirates endpoint

3: Hit Send (e.g.: `http://localhost:3001/api/pirates/58c39048b3ddce0348706837`)

## Building a Front End for Our API

Open and examine `index.html`. Note `<html ng-app="pirateApp">` and `<script src="/js/pirate.module.js"></script>`.

Edit the `('/')` route in `app.js` to send the index file:

```js
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})
```

And add the static directory for our assets to app.js:

`app.use(express.static('static'))`

Create `static/js/pirate.module.js` and add:

```js
const app = angular.module('pirateApp', []);
```

Let's run a test by pulling in data from our API.

```js
const app = angular.module('pirateApp', []);

app.controller('PirateAppController', function ($scope, $http) {
    $http.get('/api/pirates')
    .then( (res) => {
        $scope.pirates = res.data;
    });
});
```

Edit index.html:

```html
<body ng-controller="PirateAppController">
    <h1>Pirate List</h1>
    <ul>
        <li ng-repeat="pirate in pirates"  class="fade">
            {{ pirate.name }}
            <span>✖︎</span>
        </li>
    </ul>
</body>
```

and test.

Refactored controller:

```js
app.controller('PirateAppController', ($scope, $http) => {
    $http.get('/api/pirates').then( (res) => {$scope.pirates = res.data});
});
```

### Deleting a Pirate

Wire up the deletePirate function with `ng-click`:

```html
<ul>
    <li ng-repeat="pirate in pirates" class="fade">
        {{ pirate.name }} | {{ pirate._id }}
        <span ng-click="deletePirate(pirate._id)">✖︎</span>
    </li>
</ul>
```

Add a delete function to the controller in `pirate.module.js`:

```js
$scope.deletePirate = function(pid) {
    $http.delete('/api/pirates/' + pid);
}
```

e.g.:

```js
const app = angular.module('pirateApp', []);

app.controller('PirateAppController', function ($scope, $http) {
    $http.get('/api/pirates')
    .then( (res) => {
        $scope.pirates = res.data;
    });

    $scope.deletePirate = function(pid) {
        $http.delete('/api/pirates/' + pid);
    }
});
```

Clicking on an X will remove a pirate but you need to refresh to see the result. It has no effect on the view ($scope).

Pass $index to the function:

```html
<ul>
    <li ng-repeat="pirate in pirates" class="fade">
        {{ pirate.name }} {{ pirate._id }}
        <span ng-click="deletePirate($index, pirate._id)">✖︎</span>
    </li>
</ul>
```

Add a promise and use the Array method [splice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) on the index to update the scope:

```js
$scope.deletePirate = function (index, pid) {
    console.log(pid);
    $http.delete('/api/pirates/' + pid)
    .then( () => $scope.pirates.splice(index, 1))
}
```

Refactor to use arrow functions and template literals:

```js
$scope.deletePirate = (index, pid) => {
    $http.delete(`/api/pirates/${pid}`)
    .then( () => $scope.pirates.splice(index, 1))
}
```

Changes to the db persist and are relected in the view.

Delete all your pirates and navigate to `http://localhost:3001/api/import` to re-import them.

### Animation

Note: perform step 3 *only* if using sass.

1: Inject ng-animate:

`angular.module('pirateApp', ['ngAnimate'])`

2: Add ng-class to the repeated li's:

`ng-class="{ even: $even, odd: $odd }"`

3: `$ npm install --save-dev node-sass` and add a script to the manifest:
`"watch-sass": "node-sass --watch static/css/styles.scss --output static/css/  --source-map true",`

4: Note the class `fade` on the `li`'s.

Here's the css:

```css
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

Refactor module

Create `js/pirate-list.template.html` fromt he current contents of the html, e.g.:

```html
  <h1>Pirate List</h1>
  <ul>
    <li ng-repeat="pirate in pirates" ng-class="{ even: $even, odd: $odd }">
        {{ pirate.name }} {{ pirate._id }}
        <span ng-click="deletePirate($index, pirate._id)">✖︎</span>
    </li>
  </ul>
```

Refactor the module to create a component:

```js
const app = angular.module('pirateApp', ['ngAnimate']);

app.component('pirateList', {
    templateUrl: '/js/pirate-list.template.html' ,
    controller: function PirateAppController($http, $scope){
        $http.get('/api/pirates').
        then( (res) => {
            $scope.pirates = res.data;
        })

        $scope.deletePirate = function(index, pid) {
            $http.delete('/api/pirates/' + pid)
            .then( () => $scope.pirates.splice(index, 1))
        }
    }
})

```

Feed the component to the view:

```html
<body>
    <pirate-list></pirate-list>
</body>
```


#### Update a Pirate

`put` HTTP actions in a REST API correlate to an Update method. 

The route for Update also uses an :id parameter.

In pirate.controllers.js:

```js
exports.update = function (req, res) {
    const id = req.params.id;
    const updates = req.body;

    Pirate.update({ '_id': id }, updates,
        function (err) {
            if (err) return console.log(err);
            return res.sendStatus(202);
        });
};
```

Notice the updates variable storing the req.body. req.body is useful when you want to pass in larger chunks of data like a single JSON object. Here we will pass in a JSON object (following the schema) of only the model's properties you want to change.

The model's update() takes three parameters:

* JSON object of matching properties to look up the doc with to update
* JSON object of just the properties to update
* callback function that returns any errors

### Test with Curl

We will need to construct this line using ids from the pirates listing and test it in a new Terminal tab. Edit the URL to reflect both the port and id of the target pirate:

```
$ curl -i -X PUT -H 'Content-Type: application/json' -d '{"vessel": "Big Vessel"}' http://localhost:3001/api/pirates/5a1c5f02bf68ad6532ef3ced
```

This sends a JSON Content-Type PUT request to our update endpoint. That JSON object is the request body, and the long hash at the end of the URL is the id of the pirate we want to update. 

Visit the same URL from the cURL request in the browser to see the changes.

PUT actions are cumbersome to test in the browser, so we'll use Postman to run through the process of editing a pirate above.

1: Set the action to put and the url to a single entry with an id.

2: Set the body to `raw` and the `text` header to application/json

3: put `{"name": "Donald Trump", "vessel": "Trump's Junk", "weapon":"Twitter"}`

4: Test to see changes

## Adding Forms to Interface With Our API

### Add Pirate

1: Add a form to the template:

```html
<h1>Pirate List</h1>
<ul>
    <li ng-repeat="pirate in pirates" class="fade" ng-class="{ even: $even, odd: $odd }">
        {{ pirate.name }} {{ pirate._id }}
        <span ng-click="deletePirate($index, pirate._id)">✖︎</span>
    </li>
</ul>

<form ng-submit="addPirate(pirate)">
    <input type="text" ng-model="pirate.name" required placeholder="Name" />
    <input type="text" ng-model="pirate.vessel" required placeholder="Vessel" />
    <input type="text" ng-model="pirate.weapon" required placeholder="Weapon" />
    <button type="submit">Add Pirate</button>
</form>
```

2: Add to the pirateList module:

```js
$scope.addPirate = function (data) {
    $http.post('/api/pirates/', data)
        .then( () => {
            $scope.pirates.push(data);
            $scope.pirate = {};
        })
};
```

3: Test

Note the lack of an id. Edit the push to use the data returned by the response:

```js
$scope.addPirate = function (data) {
    $http.post('/api/pirates/', data)
    .then( (res) => {
        console.log(res.data)
        $scope.pirates.push(res.data);
        $scope.pirate = {};
    })
};
```

The complete component:

```js
const app = angular.module('pirateApp', ['ngAnimate']);

app.component('pirateList', {
    templateUrl: '/js/pirate-list.template.html' ,
    controller: function PirateAppController($http, $scope){
        $http.get('/api/pirates').
        then(function (response) {
            $scope.pirates = response.data;
            console.log($scope.pirates);
        })

        $scope.deletePirate = function(index, pid) {
            $http.delete('/api/pirates/' + pid)
            .then( () => $scope.pirates.splice(index, 1))
        }

        $scope.addPirate = function (data) {
            $http.post('/api/pirates/', data)
            .then( (res) => {
                console.log(res.data)
                $scope.pirates.push(res.data);
                $scope.pirate = {};
            })
        };
    }
})
```


### Create a detail view

Inject ngRoute

```js
var pirateApp = angular.module('pirateApp', ['ngAnimate', 'ngRoute']);
```

Add Routing

```js
app.config(function config($locationProvider, $routeProvider) {
    $routeProvider.
      when('/', {
          template: '<pirate-list></pirate-list>'
      }).
      when('/pirates/:pirateId', {
          template: '<pirate-detail></pirate-detail>'
      }).
      otherwise('/');
    }
);
```

Add ng-view to index.html:

```html
<body>
    <div ng-view></div>
</body>
```

Pirate Detail Template

[ng-show / hide](https://docs.angularjs.org/api/ng/directive/ngShow)

`js/pirate-detail.template.html`:

```html
<h1>Pirate Detail View</h1>
<div ng-hide="$ctrl.editorEnabled">
    <dl>
        <dt>Name</dt>
        <dd>{{ $ctrl.pirate.name }}</dd>
        <dt>Vessel</dt>
        <dd>{{ $ctrl.pirate.vessel }}</dd>
        <dt>Weapon</dt>
        <dd>{{ $ctrl.pirate.weapon }}</dd>
        <dt>ID</dt>
        <dd>{{ $ctrl.pirate._id }}</dd>
    </dl>
    <button ng-click="$ctrl.toggleEditor($ctrl.pirate)">Edit</button>
</div>
<div ng-show="$ctrl.editorEnabled">
    <form ng-submit="$ctrl.savePirate($ctrl.pirate, $ctrl.pirate._id)" name="updatePirate">
        <label>Name</label>
        <input ng-model="$ctrl.pirate.name">
        <label>Vessel</label>
        <input ng-model="$ctrl.pirate.vessel">
        <label>Weapon</label>
        <input ng-model="$ctrl.pirate.weapon">
        <label>ID</label>
        <input ng-model="$ctrl.pirate._id">
        <input type="submit" value="Save">
    </form>
</div>

<button type="submit" ng-click="$ctrl.back()">Back</button>
```

Add a link using the id `href="#!/pirates/{{ pirate._id }}"` to existing pirate-list template:

```html
<ul>
    <li ng-repeat="pirate in pirates" class="fade" ng-class="{ even: $even, odd: $odd }">
        <a href="#!/pirates/{{ pirate._id }}">{{ pirate.name }}</a>
        <span ng-click="deletePirate($index, pirate._id)">✖︎</span>
    </li>
</ul>
```

2: Create an pirateDetail component.

Use $http.get and $routeParams to grab the info from our api route:

```js
app.component('pirateDetail', {
    templateUrl: '/js/pirate-detail.template.html',
    controller:  function PirateDetailController($http, $routeParams) {
        $http.get('/api/pirates/' + $routeParams.pirateId)
        .then((response) => this.pirate = response.data);
    }
})
```

Test - you should now be able to view the detail template.

#### Back button

Note the use of `$ctrl` and `this` here instead of $scope.

```js
this.back = () => window.history.back();
```

e.g.:

```js
app.component('pirateDetail', {
    templateUrl: '/js/pirate-detail.template.html',
    controller:  function PirateDetailController($http, $routeParams) {
        $http.get('/api/pirates/' + $routeParams.pirateId)
        .then((response) => this.pirate = response.data);

        this.back = () => window.history.back();  
    }
})
```

#### Edit Button

Toggling the editor interface:

```js
this.editorEnabled = false;
this.toggleEditor = () => this.editorEnabled = !this.editorEnabled;
```

e.g.:

```js
app.component('pirateDetail', {
    templateUrl: '/js/pirate-detail.template.html',
    controller:  function PirateDetailController($http, $routeParams) {
        $http.get('/api/pirates/' + $routeParams.pirateId)
        .then((response) => this.pirate = response.data);

        this.back = () => window.history.back();

        this.editorEnabled = false;
        this.toggleEditor = () => this.editorEnabled = !this.editorEnabled;
    }
})
```

Test this by changing the value to true:

`this.editorEnabled = true;`

Add a button that only shows when the editor is on:

```html
<button type="cancel" ng-click="$ctrl.toggleEditor()">Cancel</button>
```

e.g.:

```html
<div ng-show="$ctrl.editorEnabled">
    <form ng-submit="$ctrl.savePirate($ctrl.pirate, $ctrl.pirate._id)" name="updatePirate">
        <label>Name</label>
        <input ng-model="$ctrl.pirate.name">
        <label>Vessel</label>
        <input ng-model="$ctrl.pirate.vessel">
        <label>Weapon</label>
        <input ng-model="$ctrl.pirate.weapon">
        <label>ID</label>
        <input ng-model="$ctrl.pirate._id">
        <input type="submit" value="Save">
    </form>

    <button type="cancel" ng-click="$ctrl.toggleEditor()">Cancel</button>
</div>
```

Update the controller with a save pirate function:

```js
this.savePirate = (pirate, pid) => {
    $http.put('/api/pirates/' + pid, pirate)
    .then((res) => this.editorEnabled = false )
}
```

e.g.:

```js
app.component('pirateDetail', {
    templateUrl: '/js/pirate-detail.template.html',
    controller:  function PirateDetailController($http, $routeParams) {
        $http.get('/api/pirates/' + $routeParams.pirateId)
        .then((response) => this.pirate = response.data);
        this.back = () => window.history.back(); 

        this.editorEnabled = false;
        this.toggleEditor = () => this.editorEnabled = !this.editorEnabled;

        this.savePirate = (pirate, pid) => {
            $http.put('/api/pirates/' + pid, pirate)
            .then((res) => this.editorEnabled = false )
        }
    }
})
```

The final pirate.module:

```js
const app = angular.module('pirateApp', ['ngAnimate', 'ngRoute'])

app.config(function config($locationProvider, $routeProvider) {
$routeProvider.
  when('/', {
      template: '<pirate-list></pirate-list>'
  }).
  when('/pirates/:pirateId', {
      template: '<pirate-detail></pirate-detail>'
  }).
  otherwise('/');
}
);
app.component('pirateList', {
    templateUrl: '/js/pirate-list.template.html' ,
    controller: function PirateAppController($http, $scope){
        $http.get('/api/pirates').
        then( (res) => {
            $scope.pirates = res.data;
        })

        $scope.deletePirate = function(index, pid) {
            $http.delete('/api/pirates/' + pid)
            .then( () => $scope.pirates.splice(index, 1))
        }
        $scope.addPirate = function (data) {
            $http.post('/api/pirates/', data)
            .then( (res) => {
                console.log(res.data)
                $scope.pirates.push(res.data);
                $scope.pirate = {};
            })
        };
    }
})

app.component('pirateDetail', {
    templateUrl: '/js/pirate-detail.template.html',
    controller:  function PirateDetailController($http, $routeParams) {
        $http.get('/api/pirates/' + $routeParams.pirateId)
        .then((response) => this.pirate = response.data);

        this.back = () => window.history.back();

        this.editorEnabled = false;
        this.toggleEditor = () => this.editorEnabled = !this.editorEnabled;

        this.savePirate = (pirate, pid) => {
            $http.put('/api/pirates/' + pid, pirate)
            .then((res) => this.editorEnabled = false )
        }
    }
})
```

The final pirate-detail template:

```html
<h1>Pirate Detail View</h1>
<div ng-hide="$ctrl.editorEnabled">
    <dl>
        <dt>Name</dt>
        <dd>{{ $ctrl.pirate.name }}</dd>
        <dt>Vessel</dt>
        <dd>{{ $ctrl.pirate.vessel }}</dd>
        <dt>Weapon</dt>
        <dd>{{ $ctrl.pirate.weapon }}</dd>
        <dt>ID</dt>
        <dd>{{ $ctrl.pirate._id }}</dd>
    </dl>
    <button ng-click="$ctrl.toggleEditor($ctrl.pirate)">Edit</button>
</div>
<div ng-show="$ctrl.editorEnabled">
    <form ng-submit="$ctrl.savePirate($ctrl.pirate, $ctrl.pirate._id)" name="updatePirate">
        <label>Name</label>
        <input ng-model="$ctrl.pirate.name">
        <label>Vessel</label>
        <input ng-model="$ctrl.pirate.vessel">
        <label>Weapon</label>
        <input ng-model="$ctrl.pirate.weapon">
        <label>ID</label>
        <input ng-model="$ctrl.pirate._id">
        <input type="submit" value="Save">
    </form>
    <button type="cancel" ng-click="$ctrl.toggleEditor()">Cancel</button>
</div>

<button type="submit" ng-click="$ctrl.back()">Back</button>
```


The final pirate-list template:

```html
<h1>Pirate List</h1>
<ul>
    <li ng-repeat="pirate in pirates" class="fade" ng-class="{ even: $even, odd: $odd }">
        <a href="#!/pirates/{{ pirate._id }}">{{ pirate.name }}</a>
        <span ng-click="deletePirate($index, pirate._id)">✖︎</span>
    </li>
</ul>

<form ng-submit="addPirate(pirate)">
    <input type="text" ng-model="pirate.name" required placeholder="Name" />
    <input type="text" ng-model="pirate.vessel" required placeholder="Vessel" />
    <input type="text" ng-model="pirate.weapon" required placeholder="Weapon" />
    <button type="submit">Add Pirate</button>
</form>
```





var pirateApp = angular.module('pirateApp', ['ngAnimate', 'ngRoute']);

angular.module('pirateApp')
	.config(function config($locationProvider, $routeProvider) {
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



angular.module('pirateApp').component('pirateList', {
	template: `
	<h1>Pirates</h1>
	<ul>
	    <li ng-repeat="pirate in pirates" class="fade" ng-class="{ even: $even, odd: $odd }">
	        <a href="#!/pirates/{{ pirate._id }}">{{ pirate.name }}</a>
	        <span ng-click="deletePirate($index, pirate._id)">X</span>
	    </li>
	</ul>

	<form ng-submit="addPirate(pirate)">
	    <input type="text" ng-model="pirate.name" />
	    <input type="text" ng-model="pirate.vessel" />
	    <input type="text" ng-model="pirate.weapon" />
	    <button type="submit">Add Pirate</button>
	</form>
	`,
	controller: function PirateAppController($http, $scope){
			$http.get('/api/pirates').
				then(function (response) {
					$scope.pirates = response.data;
					console.log($scope.pirates);
				})

			$scope.deletePirate = function (index, pid) {
				console.log(pid);
				$http.delete('/api/pirates/' + pid)
				.then( () => $scope.pirates.splice(index, 1))
			}

			$scope.addPirate = function (data) {
		    $http.post('/api/pirates/', data)
		        .then(function () {
		            $scope.pirates.push(data);
		            $scope.pirate = {};
		        })
				}
			}
})

angular.module('pirateApp').component('pirateDetail', {
	template: `
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
		    <form ng-submit="$ctrl.savePirate($ctrl.pirate)" name="updatePirate">
		        <label>Name</label>
		        <input type="text" ng-model="$ctrl.pirate.name">
		        <label>Vessel</label>
		        <input type="text" ng-model="$ctrl.pirate.vessel">
		        <label>Weapon</label>
		        <input type="text" ng-model="$ctrl.pirate.weapon">
		        <button type="submit">Save</button>
		        <button type="cancel" ng-click="$ctrl.toggleEditor()">Cancel</button>
		    </form>
		</div>
		<button type="submit" ng-click="$ctrl.back()">Back</button>
		`,
	controller:  function PirateDetailController($http, $routeParams) {
    $http.get('/api/pirates/' + $routeParams.pirateId)
        .then((response) => this.pirate = response.data);

      this.back = function () {
        window.history.back();
    	}	

    	this.editorEnabled = false;

      this.toggleEditor = () => this.editorEnabled = !this.editorEnabled;

      this.savePirate = (pirate) => {
        	$http.put('/api/pirates/' + pirate._id, pirate)
          .then(() => this.editorEnabled = false )
        }


    }
})





























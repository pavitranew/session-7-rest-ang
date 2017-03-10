const pirateApp = angular.module('pirateApp', ['ngAnimate'])

pirateApp.component('pirateList', {
	template: `
	<h1>Pirates</h1>
	<ul>
	<li ng-repeat="pirate in $ctrl.pirates" class="fade" ng-class="{ even: $even, odd: $odd }">
	{{ pirate.name }} | {{ pirate.vessel }} | {{ pirate.weapon }}
	<span ng-click="$ctrl.deletePirate($index, pirate._id)">X</span>
	</li>
	</ul>
	<button ng-click="$ctrl.reload()">Reload</button>
	`,
	controller: function PirateAppController($http){
		$http.get('/api/pirates')
		.then( (response) => this.pirates = response.data)

		this.deletePirate = (index, pid) => {
			$http.delete('/api/pirates/' + pid)
			.then( () => this.pirates.splice(index, 1))
		}

		this.reload = () => $http.get('api/import/')
	}	
})

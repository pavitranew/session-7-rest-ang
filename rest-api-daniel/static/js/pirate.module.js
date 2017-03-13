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
			.then(function () {
				$scope.pirates.push(data);
				$scope.pirate = {};
			})
		};
	}
})


angular.module('pirateApp').component('pirateDetail', {
	templateUrl: '/js/pirate-detail.template.html',
	controller:  function PirateDetailController($http, $routeParams) {
		$http.get('/api/pirates/' + $routeParams.pirateId)
		.then((response) => this.pirate = response.data);

		this.back = function () {
			window.history.back();
		}

		this.savePirate = (pirate, pid) => {
			$http.put('/api/pirates/' + pid)
			.then((res) => this.editorEnabled = false )
		}

		this.editorEnabled = false;
		this.toggleEditor = () => this.editorEnabled = !this.editorEnabled;
	}
})
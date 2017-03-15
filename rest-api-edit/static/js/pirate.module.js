var pirateApp = angular.module('pirateApp', ['ngAnimate', 'ngRoute']);

angular.module('pirateApp')
.config(function config($locationProvider, $routeProvider) {
	$routeProvider.
	when('/', {
		template: '<pirate-list></pirate-list>',
		className: 'home'
	}).
	when('/pirates/:pirateId', {
		template: '<pirate-detail></pirate-detail>'
	}).
	otherwise('/');
}
);

angular.module('pirateApp').component('pirateList', {
	templateUrl: '/js/pirate-list.template.html',
	controller: PirateListController
})

angular.module('pirateApp').component('pirateDetail', {
	templateUrl: '/js/pirate-detail.template.html',
	controller: PirateDetailController
})

function PirateListController($http){
	$http.get('/api/pirates').
	then( (response) => {
		this.pirates = response.data;
		console.log('$http.get works!');
	})

	this.deletePirate = (index, pid) => {
		$http.delete('/api/pirates/' + pid)
		.then( () => this.pirates.splice(index, 1))
		console.log('$http.delete works!');
	}

	this.addPirate = function (data) {
		$http.post('/api/pirates/', data)
		.then( () => {
			this.pirates.push(data);
			this.pirate = {};
			console.log('$http.post works!');
		})
	}
}

function PirateDetailController($http, $routeParams) {
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

pirateApp.controller('parent', function($scope) {
	$scope.pageClass = 'small';
});
























angular.module('pirateApp', ['ngAnimate'])
.controller('PirateAppController', function ($scope, $http) {
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
});
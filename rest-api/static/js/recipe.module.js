const app = angular.module('recipeApp', ['ngAnimate']);

app.controller('RecipeAppController', function ($scope, $http) {
  $http.get('/api/recipes')
  .then( (res) => {
      $scope.recipes = res.data;
    });
  
    $scope.deleteRecipe = (index, recipeid) => $http.delete(`/api/recipes/${recipeid}`)
    .then( () => $scope.recipes.splice(index, 1));
  
});
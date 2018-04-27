const app = angular.module('recipeApp', ['ngAnimate', 'ngRoute']);

app.config(function config($locationProvider, $routeProvider) {
  $routeProvider
      .when('/', {
          template: '<recipe-list></recipe-list>'
      })
      .when('/recipes/:recipeId', {
          template: '<recipe-detail></recipe-detail>'
      })
      .otherwise('/');
  $locationProvider.html5Mode(true);
});

app.component('recipeDetail', {
  templateUrl: '/js/recipe-detail.template.html',
  controller: function RecipeDetailController($http, $routeParams) {
      $http.get('/api/recipes/' + $routeParams.recipeId).then(response => (this.recipe = response.data));
  
    this.back = () => window.history.back();
    
    this.editorEnabled = false;
    this.toggleEditor = () => (this.editorEnabled = !this.editorEnabled);

    this.saveRecipe = (recipe, recipeid) => {
      $http.put('/api/recipes/' + recipeid, recipe).then(res => (this.editorEnabled = false));
  };
    
  }
});


app.component('recipeList', {
    templateUrl: '/js/recipe-list.template.html',
    controller: function RecipeAppController($http, $scope) {
        $http.get('/api/recipes').then(res => {
            $scope.recipes = res.data;
        });

      $scope.deleteRecipe = function (index, recipeid) {
        $http.delete('/api/recipes/' + recipeid).then(() => $scope.recipes.splice(index, 1));
      };

      $scope.addRecipe = function(data) {
        $http.post('/api/recipes/', data).then(res => {
            console.log(res.data);
            $scope.recipes.push(res.data);
            $scope.recipe = {};
        });
    };
      
        // $scope.addRecipe = function(data) {
        //   $http.post('/api/recipes/', data).then(() => {
        //       $scope.recipes.push(data);
        //   });
        // };
      
    }
});
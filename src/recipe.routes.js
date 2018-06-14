const recipes = require('./recipe.controllers');

const recipeRoutes = function(app) {
    app.get('/api/recipes', recipes.findAll);
    app.get('/api/recipes/:id', recipes.findById);
    app.post('/api/recipes', recipes.add);
    app.put('/api/recipes/:id', recipes.update);
    app.delete('/api/recipes/:id', recipes.delete);
    app.get('/api/import', recipes.import);
}

module.exports = recipeRoutes;
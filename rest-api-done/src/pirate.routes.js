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
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PirateSchema = new Schema({
    name: String,
    vessel: String,
    weapon: String
});

module.exports = mongoose.model('Pirate', PirateSchema);
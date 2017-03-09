var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
var Pirate = mongoose.model('Pirate');


var PirateSchema = new Schema({
    name: String,
    vessel: String,
    weapon: String
});

mongoose.model('Pirate', PirateSchema);

// exports pirateModel
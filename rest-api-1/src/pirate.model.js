const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PirateSchema = new Schema({
    name: String,
    vessel: String,
    weapon: String
});

module.exports = mongoose.model('Pirate', PirateSchema);
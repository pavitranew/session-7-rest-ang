const mongoose = require('mongoose');
const Pirate = mongoose.model('Pirate');

exports.findAll = function (req, res) {
    Pirate.find({}, function (err, results) {
        return res.send(results);
    });
};
// exports.findById = function () { };
exports.findById = function (req, res) {
    const id = req.params.id;
    Pirate.findOne({ '_id': id }, function (err, result) {
        return res.send(result);
    });
};

// exports.add = function () { };
exports.add = function (req, res) {
    Pirate.create(req.body, function (err, pirate) {
        console.log(req.body)
        if (err) return console.log(err);
        return res.send(pirate);
    });
};

// exports.update = function () { };
exports.update = function (req, res) {
    const id = req.params.id;
    const updates = req.body;

    Pirate.update({ "_id": id }, req.body,
        function (err, numberAffected) {
            if (err) return console.log(err);
            console.log('Updated %d pirates', numberAffected);
            return res.sendStatus(202);
        });
};

// exports.delete = function () { };
exports.delete = function (req, res) {
    var id = req.params.id;
    Pirate.remove({ '_id': id }, function (result) {
        return res.send(result);
    });
};


exports.import = function (req, res) {
    Pirate.create(
        { "name": "William Kidd", "vessel": "Adventure Galley", "weapon": "Sword" },
        { "name": "Samuel Bellamy", "vessel": "Whydah", "weapon": "Cannon" },
        { "name": "Mary Read", "vessel": "Rackham", "weapon": "Knife" },
        { "name": "John Rackham", "vessel": "The Calico", "weapon": "Peg Leg" }
        , function (err) {
            if (err) return console.log(err);
            return res.sendStatus(202);
        });
};
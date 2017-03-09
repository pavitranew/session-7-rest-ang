exports.findAll = function(req, res){
	res.send(
		[{
			"id": 1,
			"name": "Max",
			"vessel": "HMS Booty",
			"weapon": "sword"
		}]
		);
};
exports.findById = function () { };
exports.add = function () { };
exports.update = function () { };
exports.delete = function () { };
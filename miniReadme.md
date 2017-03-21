exports.import = function (req, res) {
    // Pirate below refers to the mongoose schema. create() is a mongoose method
    Pirate.create(
        { "name": "William Kidd", "vessel": "Adventure Galley", "weapon": "Sword" },
        { "name": "Samuel Bellamy", "vessel": "Whydah", "weapon": "Cannon" },
        { "name": "Mary Read", "vessel": "Rackham", "weapon": "Knife" },
        { "name": "John Rackham", "vessel": "The Calico", "weapon": "Peg Leg" }
        , function (err) {
            if (err) return console.log(err);
            return res.send(202);
        });
};

curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "Donald Trump", "vessel": "Trumps Junk", "weapon":"Twitter"}' http://localhost:3001/api/pirates

$ curl -i -X DELETE http://localhost:3001/api/pirates/58c39048b3ddce0348706837

$ curl -i -X PUT -H 'Content-Type: application/json' -d '{"vessel": "Big Vessel"}' http://localhost:3001/api/pirates/58ced55bed7a7d6d28c46752
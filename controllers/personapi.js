var Person = require('../models/person');

exports.show = function(req, res){
    Person.findOne({id: req.params.id}, function(error, person) {
        res.send(person);
    });
}

exports.post = function(req, res) {
    new Person({id: req.body.id, name: req.body.name, birth: req.body.birth,
        roles: req.body.roles, films: req.body.films}).save();
}

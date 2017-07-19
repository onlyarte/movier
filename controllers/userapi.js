var User = require('../models/user');

var findById = function(id, callback){
    User.findOne({_id: id}, function(error, user) {
        if(!error){
            callback(user);
        }
    });
}

var add = function(user, callback){
    new User({_
        _id: user.id,
        _email: user.email,
        _name: user.name,
        _image: user.image,
        _films: {
            _favs: user.films.favs,
            _watchlist: user.films.watchlist,
            _watched: user.films.watched
        }
    }).save();
}

module.exports.findById = findById;
module.exports.add = add;

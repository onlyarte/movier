var filmapi = require('./filmapi');
var User = require('../models/user');

var findById = function(id, callback){
    User.findOne({ _id: id }).
        populate('_films').
        exec(function(error, user){
            if(!error){
                callback(user);
            }
        });
}

var add = function(user, callback){
    new User({
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
    console.log('user added to database')
    // run optional callback
    if(typeof callback === 'function')
        callback();
}

var addToFav = function(userId, filmId, callback){
    filmapi.add(filmId);
    User.findOneAndUpdate(
        { _id: userId },
        { $push: { '_films._favs': filmId } },
        { new: true },
        function(error, user){
            if(!error)
                callback(user);
            else
                callback('');
        }
    );
}

var addToWatchlist = function(userId, filmId, callback){
    filmapi.add(filmId);
    User.findOneAndUpdate(
        { _id: userId },
        { $push: { '_films._watchlist': filmId } },
        { new: true },
        function(error, user){
            if(!error)
                callback(user);
            else
                callback('');
        }
    );
}

var addToWatched = function(userId, filmId, callback){
    filmapi.add(filmId);
    User.findOneAndUpdate(
        { _id: userId },
        { $push: { '_films._watched': filmId } },
        { new: true },
        function(error, user){
            if(!error)
                callback(user);
            else
                callback('');
        }
    );
}

var removeFromFav = function(userId, filmId, callback){
    User.findOneAndUpdate(
        { _id: userId },
        { $pull: { '_films._favs': filmId } },
        { new: true },
        function(error, user){
            if(!error)
                callback(user);
            else
                callback('');
        }
    );
}

var removeFromWatchlist = function(userId, filmId, callback){
    User.findOneAndUpdate(
        { _id: userId },
        { $pull: { '_films._watchlist': filmId } },
        { new: true },
        function(error, user){
            if(!error)
                callback(user);
            else
                callback('');
        }
    );
}

var removeFromWatched = function(userId, filmId, callback){
    User.findOneAndUpdate(
        { _id: userId },
        { $pull: { '_films._watched': filmId } },
        { new: true },
        function(error, user){
            if(!error)
                callback(user);
            else
                callback('');
        }
    );
}

module.exports.findById = findById;
module.exports.add = add;
module.exports.addToFav = addToFav;
module.exports.addToWatchlist = addToWatchlist;
module.exports.addToWatched = addToWatched;
module.exports.removeFromFav = removeFromFav;
module.exports.removeFromWatchlist = removeFromWatchlist;
module.exports.removeFromWatched = removeFromWatched;

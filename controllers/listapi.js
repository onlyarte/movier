var filmapi = require('./filmapi');
var List = require('../models/list');

var findById = function(id, callback){
    List.findOne({ _id: id })
    .populate('_films')
    .exec(function(error, list){
        if(error)
            return callback(error, null);
        if(!list)
            return callback(new Error('List not found'), null);

        callback(null, list);
    });
}

var add = function(list){
    new List({
        _owner: list.owner,
        _is_open: list.is_open,
        _films: list.films
    }).save();
}

var remove = function(id, callback){
    List.remove({ _id: id }, function(error){
        if(error) return callback(error);
        callback(null);
    });
}

var addToList = function(listId, filmId, callback){
    filmapi.add(filmId);
    List.findOneAndUpdate(
        { _id: listId },
        { $push: { '_films': filmId } },
        { new: true }
    ).populate('_films')
    .exec(function(error, list){
        if(error)
            return callback(error, null);
        if(!list)
            return callback(new Error('List not found'), null);

        callback(null, list);
    });
}

var removeFromList = function(listId, filmId, callback){
    List.findOneAndUpdate(
        { _id: listId },
        { $pull: { '_films': filmId } },
        { new: true }
    ).populate('_films')
    .exec(function(error, list){
        if(err)
            return callback(error, null);
        if(!list)
            return callback(new Error('List not found'), null);

        callback(null, list);
    });
}

module.exports.findById = findById;
module.exports.add = add;
module.exports.addToList = addToList;
module.exports.removeFromList = removeFromList;

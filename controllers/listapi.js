var filmapi = require('./filmapi');
var List = require('../models/list');

var findById = function(id, callback){
    List.findOne({ _id: id })
    .populate('_owner')
    .populate('_films')
    .exec(function(error, list){
        if(error)
            return callback(error, null);
        if(!list)
            return callback(new Error('List not found'), null);

        callback(null, list);
    });
}

var add = function(list, callback){
    new List({
        _owner: list.owner,
        _is_open: list.is_open,
        _name: list.name,
        _films: list.films
    }).save(callback);
}

var remove = function(id, callback){
    List.remove({ _id: id }, function(error){
        if(error) return callback(error);
        callback(null);
    });
}

var addToList = function(listId, filmId, callback){
    filmapi.add(filmId, function(error, film){
        if(error)
            return callback(error, null);


        List.findOneAndUpdate(
            { _id: listId },
            { $addToSet: { '_films': filmId } },
            { new: true }
        ).populate('_films')
        .exec(function(error, list){
            if(error)
                return callback(error, null);
            if(!list)
                return callback(new Error('List not found'), null);

            callback(null, list);
        });
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

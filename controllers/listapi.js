const filmapi       = require('./filmapi');
const channelapi    = require('./channelapi');

const List          = require('../models/list');

const get = function getListById(id, callback) {
    List.findById(id)
    .populate('owner')
    .populate('films')
    .exec((error, list) => {
        if(error)
            return callback(error, null);
        if(!list)
            return callback(new Error('List not found'), null);
        
        return callback(null, list);
    });
}

const add = function addList (list, filmid, callback) {
    new List(list)
    .save((error, savedList) => {
        if (error)
            return callback(error, null);
        
        addFilm(
            savedList.id, 
            filmid,
            (error, initSavedList) => {
                if(error) 
                    return callback(error, null);
                
                return callback(null, initSavedList);
            }
        );
    });
}

const remove = function removeList (id, callback) {
    List.remove({ id })
    .exec(error => {
        if(error) 
            return callback(error);

        return callback(null);
    });
}

const addFilm = function addFilmToList(listId, filmId, callback) {
    List.findByIdAndUpdate(
        listId,
        { 
            $addToSet: { 
                films: filmId,
            },
        },
        { 
            new: true 
        },
    )
    .populate('films')
    .exec((error, list) => {
        if(error)
            return callback(error, null);
        if(!list)
            return callback(new Error('List not found'), null);

        return callback(null, list);
    });
}

const removeFilm = function removeFilmFromList(listId, filmId, callback) {
    List.findByIdAndUpdate(
        listId,
        { 
            $pull: { 
                films: filmId,
            },
        },
        { 
            new: true,
        },
    )
    .populate('films')
    .exec((error, list) => {
        if(error)
            return callback(error, null);
        if(!list)
            return callback(new Error('List not found'), null);

        callback(null, list);
    });
}

module.exports.get = get;
module.exports.add = add;
module.exports.remove = remove;
module.exports.addFilm = addFilm;
module.exports.removeFilm = removeFilm;

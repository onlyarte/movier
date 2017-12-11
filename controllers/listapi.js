const filmapi       = require('./filmapi');
const channelapi    = require('./channelapi');

const List          = require('../models/list');

const get = function getListById(id, callback) {
    List.findById(id)
    .populate('owner', '-password')
    .exec((error, list) => {
        if (error) return callback(error, null);
        if (!list) return callback(null, null);

        populateFilms(list.films, (error, films) => {
            if (error) return callback(error, null);
            list.films = films;
            callback(
                null, 
                {
                    films,
                    id: list.id,
                    owner: list.owner,
                    name: list.name,
                    cover: list.cover,
                },
            );
        });
    });
}

const add = function addList (list, filmid, callback) {
    filmapi.get(
        filmid,
        (error, film) => {
            if (error) return callback(error, null);

            list.cover = film.poster;
            list.films = [filmid]

            new List(list)
            .save(callback);
        },
    );
    
}

const remove = function removeList (id, callback) {
    List.findByIdAndRemove(id)
    .exec(callback);
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
    .exec(callback);
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
    .exec((error, list) => {
        if (error) return callback(error, null);
        if (!list) return callback(null, null);

        // remove list if no films left
        List.aggregate([
            {
                $match: {
                    id: listId,
                },
            },
            {
                $project: {
                    numOfFilms: { 
                        $size: "$films",
                    },
                },
            },
        ])
        .exec((error, lists) => { // error or array containing one list
            if (error) return callback(error, null);

            if (!lists[0] && lists[0].numOfFilms !== 0){
                return callback(null, list);
            }
            
            remove(
                listid,
                error => {
                    if (error) return callback(error, null);
                    
                    return callback(null, null);
                },
            );
        });
    });
}

const findByOwner = function getOwnerLists(ownerId, callback) {
    List.find({
        owner: ownerId,
    })
    .exec(callback);
}

const populateFilms = function(ids, callback) {
    const pool = ids.map(id => {
        return new Promise((resolve, reject) => {
            filmapi.get(id, (error, film) => {
                if (error) reject(error);
                else resolve(film);
            });
        });
    });
    Promise.all(pool).then(
        films => { 
            callback(null, films);
        },
        reason => {
            callback(reason, null);
        },
    );
}

module.exports.get          = get;
module.exports.add          = add;
module.exports.remove       = remove;
module.exports.addFilm      = addFilm;
module.exports.removeFilm   = removeFilm;
module.exports.findByOwner  = findByOwner;

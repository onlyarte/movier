const filmapi = require('./filmapi');

const List = require('../models/list');

const get = function getListById(id) {
  return List
    .findById(id)
    .populate('owner', '-password')
    .exec()
  // populate films
    .then(list => (
      Promise.all(list.films.map(fid => filmapi.get(fid)))
        .then(films => ({
          films: films.reverse(),
          id: list.id,
          owner: list.owner,
          name: list.name,
          cover: list.cover,
        }))
    ));
};

const add = function addList(list) {
  return filmapi
    .get(list.films[0])
    .then((film) => {
      if (!film) throw new Error('Film not found');
      return new List({
        ...list,
        cover: film.poster,
      }).save()
        .then(added => added.toObject());
    });
};

const remove = function removeList(id) {
  return List
    .findByIdAndRemove(id)
    .exec()
    .then(removed => removed.toObject());
};

// TODO: update list poster
const addFilm = function addFilmToList(listId, filmId) {
  return List
    .findByIdAndUpdate(
      listId,
      {
        $addToSet: {
          films: filmId,
        },
        $set: {
          updated: Date.now(),
        },
      },
      {
        new: true,
      },
    )
    .exec()
    .then(updated => updated.toObject());
};

const removeFilm = function removeFilmFromList(listId, filmId) {
  return List
    .findByIdAndUpdate(
      listId,
      {
        $pull: {
          films: filmId,
        },
        $set: {
          updated: Date.now(),
        },
      },
      {
        new: true,
      },
    )
    .exec()
  // if no films left, remove list
    .then((list) => {
      if (list.films.length === 0) {
        return list
          .remove()
          .then(removed => removed.toObject());
      }
      return list.toObject();
    });
};

const findByOwner = function getOwnerLists(ownerId) {
  return List
    .find({
      owner: ownerId,
    })
    .sort('-updated')
    .exec();
};

module.exports.get = get;
module.exports.add = add;
module.exports.remove = remove;
module.exports.addFilm = addFilm;
module.exports.removeFilm = removeFilm;
module.exports.findByOwner = findByOwner;

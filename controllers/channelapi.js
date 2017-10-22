const listapi = require('./listapi');
const Channel = require('../models/channel');

let findById = function(id, callback){
    Channel.findOne({ _id: id })
    .populate('_lists')
    .populate({
        path: '_lists',
        populate: {
            path: '_films',
            model: 'Film'
        }
    })
    .populate({
        path: '_saved_lists',
        populate: {
            path: '_films',
            model: 'Film'
        }
    })
    .exec(function(error, channel){
        if(error)
            return callback(error, null);
        if(!channel)
            return callback(new Error('Channel not found'), null);

        callback(null, channel);
    });
}

let add = function(channel, callback){
    new Channel({
        _id: channel.id,
        _email: channel.email,
        _password: channel.password,
        _name: channel.name,
        _image: channel.image,
        _lists: channel.lists,
        _saved_lists: channel.saved_lists
    }).save(callback);
}

let remove = function(id, callback){
    Channel.remove({ _id: id }, function(error){
        if(error) return callback(error);
        callback(null);
    });
}

let addList = function(id, listid, callback){
    Channel.findByIdAndUpdate(
        id,
        { $addToSet: { '_lists': listid } },
        { new: true }
    ).populate('_lists')
    .populate({
        path: '_lists',
        populate: {
            path: '_films',
            model: 'Film'
        }
    })
    .populate({
        path: '_saved_lists',
        populate: {
            path: '_films',
            model: 'Film'
        }
    })
    .exec(function(error, channel){
        if(error)
            return callback(error, null);
        if(!channel)
            return callback(new Error('Channel not found'), null);

        callback(null, channel);
    });
}

let saveList = function(id, listid, callback){
    Channel.findByIdAndUpdate(
        id,
        { $addToSet: { '_saved_lists': listid } },
        { new: true }
    ).populate('_lists')
    .populate({
        path: '_lists',
        populate: {
            path: '_films',
            model: 'Film'
        }
    })
    .populate({
        path: '_saved_lists',
        populate: {
            path: '_films',
            model: 'Film'
        }
    })
    .exec(function(error, channel){
        if(error)
            return callback(error, null);
        if(!channel)
            return callback(new Error('Channel not found'), null);

        callback(null, channel);
    });
}

let removeFromSaved = function(id, listid, callback){
    Channel.findByIdAndUpdate(
        id,
        { $pull: { '_saved_lists': listid } },
        { new: true }
    ).populate('_lists')
    .populate({
        path: '_lists',
        populate: {
            path: '_films',
            model: 'Film'
        }
    })
    .populate({
        path: '_saved_lists',
        populate: {
            path: '_films',
            model: 'Film'
        }
    })
    .exec(function(error, channel){
        if(error)
            return callback(error, null);
        if(!channel)
            return callback(new Error('Channel not found'), null);

        callback(null, channel);
    });
}

module.exports.findById = findById;
module.exports.add = add;
module.exports.remove = remove;
module.exports.addList = addList;
module.exports.saveList = saveList;
module.exports.removeFromSaved = removeFromSaved;

const listapi = require('./listapi');
const Channel = require('../models/channel');

//TODO: POPULATE LISTS USING LISTAPI

const get = function getChannelById(id, callback) {
    Channel.findById(id)
    .populate('lists')
    .populate('saved_lists')
    .exec((error, channel) => {
        if(error)
            return callback(error, null);
        if(!channel)
            return callback(new Error('Channel not found'), null);

        callback(null, channel);
    });
}

const add = function addChannel(channel, callback) {
    new Channel(channel).save(callback);
}

const remove = function removeChannel(id, callback) {
    Channel.remove({ id })
    .exec(error => {
        if(error) 
            return callback(error);
        callback(null);
    });
}

const addList = function addListToChannelLists(chid, listid, callback) {
    Channel.findByIdAndUpdate(
        chid,
        { 
            $addToSet: { 
                lists: listid,
            } 
        },
        { 
            new: true,
        },
    )
    .populate('lists')
    .populate('saved_lists')
    .exec((error, channel) => {
        if(error)
            return callback(error, null);
        if(!channel)
            return callback(new Error('Channel not found'), null);

        callback(null, channel);
    });
}

const saveList = function addListToChannelSaved(chid, listid, callback) {
    Channel.findByIdAndUpdate(
        chid,
        { 
            $addToSet: { 
                saved_lists: listid,
            },
        },
        { 
            new: true,
        },
    )
    .populate('lists')
    .populate('saved_lists')
    .exec((error, channel) => {
        if(error)
            return callback(error, null);
        if(!channel)
            return callback(new Error('Channel not found'), null);

        callback(null, channel);
    });
}

const unsaveList = function removeListFromChannelSaved(cdid, listid, callback) {
    Channel.findByIdAndUpdate(
        chid,
        { 
            $pull: { 
                saved_lists: listid,
            },
        },
        { 
            new: true,
        },
    )
    .populate('lists')
    .populate('saved_lists')
    .exec((error, channel) => {
        if(error)
            return callback(error, null);
        if(!channel)
            return callback(new Error('Channel not found'), null);

        callback(null, channel);
    });
}

module.exports.get = get;
module.exports.add = add;
module.exports.remove = remove;
module.exports.addList = addList;
module.exports.saveList = saveList;
module.exports.unsaveList = unsaveList;

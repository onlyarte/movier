const Channel = require('../models/channel');

const listapi = require('./listapi');

const get = function getChannelById(id, callback) {
    Channel.findById(
        id,
        {
            password: 0,
        },
    )
    .populate('saved_lists')
    .populate('following', '-password')
    .exec((error, channel) => {
        if (error) return callback(error, null);
        if (!channel) return callback(null, null);

        populateFollowers(id, (error, followers) => {
            if (error) return callback(error, null);

            populateLists(id, (error, lists) => {
                if (error) return callback(error, null);

                channel.lists = lists;
                channel.followers = followers;
                return callback(null, channel); // return populated channel
            })
        });
    });
}

const getPassword = function getChannelPasswordForAuth(id, callback) {
    Channel.findById(
        id,
        {
            password: 1,
        },
    )
    .exec((error, channel)  => {
        if (error) return callback(error);
        if (!channel) return callback(null, null);
        return callback(null, channel.password);
    });
}

const add = function addChannel(channel, callback) {
    new Channel(channel).save(callback);
}

const remove = function removeChannel(id, callback) {
    Channel.findByIdAndRemove(id)
    .exec(callback);
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
            new: true 
        },
    )
    .exec(callback);
}

const unsaveList = function removeListFromChannelSaved(chid, listid, callback) {
    Channel.findByIdAndUpdate(
        chid,
        { 
            $pull: { 
                saved_lists: listid,
            },
        },
        { 
            new: true 
        },
    )
    .exec(callback);
}

const populateFollowers = function ({ id }, callback) {
    Channel.find(
        {
            following: {
                $elemMatch: {
                    $eq: id,                 
                },
            },
        },
        {
            password: 0,
        },
    )
    .exec(callback);
}

const populateLists = function (id, callback) {
    listapi.findByOwner(id, callback);
}

module.exports.get          = get;
module.exports.add          = add;
module.exports.remove       = remove;
module.exports.saveList     = saveList;
module.exports.unsaveList   = unsaveList;
module.exports.getPassword  = getPassword;

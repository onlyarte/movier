var listapi = require('./listapi');
var Channel = require('../models/channel');

var findById = function(id, callback){
    Channel.findOne({ _id: id })
    .populate('_lists')
    .populate({
        path: '_lists',
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

var add = function(channel){
    new Channel({
        _id: channel.id,
        _email: channel.email,
        _password: channel.password,
        _name: channel.name,
        _image: channel.image,
        _lists: channel.lists
    }).save();
}

var remove = function(id, callback){
    Channel.remove({ _id: id }, function(error){
        if(error) return callback(error);
        callback(null);
    });
}

module.exports.findById = findById;
module.exports.add = add;
module.exports.remove = remove;

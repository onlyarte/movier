const Channel = require('../models/channel');

const listapi = require('./listapi');

const getFollowers = function getChannelFollowers(id) {
  return Channel
    .find({
      following: {
        $elemMatch: {
          $eq: id,
        },
      },
    })
    .select('-password')
    .exec();
};

const get = function getChannelById(id) {
  return Channel
    .findById(id)
    .select('-password')
    .populate('saved_lists')
    .populate('following', '-password')
    .exec()
  // populate followers
    .then((channel) => {
      if (!channel) throw new Error('Channel not found');
      const channelObj = channel.toObject();

      return getFollowers(channelObj.id)
        .then(followers => ({ ...channelObj, followers }));
    })
  // populate lists
    .then(channel => (
      listapi
        .findByOwner(channel.id)
        .then(lists => ({ ...channel, lists }))
    ));
};

const add = function addChannel(channel) {
  return new Channel(channel)
    .save()
    .then(added => added.toObject());
};

const remove = function removeChannel(id) {
  return Channel
    .findByIdAndRemove(id)
    .exec()
    .then(removed => removed.toObject());
};

const update = function updateChannelInfo({ id, email, password, name, image }) {
  return Channel
    .findById(id)
    .exec()
    .then((channel) => {
      // if there is new value, then asign, else leave previous
      channel.email = email || channel.email;
      channel.password = password || channel.password;
      channel.name = name || channel.name;
      channel.image = image || channel.image;

      return channel
        .save()
        .then(updated => updated.toObject());
    });
};

const follow = function addChannelToFollowing(channelId, followingId) {
  return Channel
    .findByIdAndUpdate(
      channelId,
      {
        $addToSet: {
          following: followingId,
        },
      },
      {
        new: true,
      },
    )
    .select('-password')
    .exec()
    .then(updated => updated.toObject());
};

const unfollow = function removeChannelFromFollowing(channelId, followingId) {
  return Channel
    .findByIdAndUpdate(
      channelId,
      {
        $pull: {
          following: followingId,
        },
      },
      {
        new: true,
      },
    )
    .select('-password')
    .exec()
    .then(updated => updated.toObject);
};

const saveList = function addListToChannelSaved(channelId, listId) {
  return Channel
    .findByIdAndUpdate(
      channelId,
      {
        $addToSet: {
          saved_lists: listId,
        },
      },
      {
        new: true,
      },
    )
    .select('-password')
    .exec()
    .then(updated => updated.toObject);
};

const unsaveList = function removeListFromChannelSaved(channelId, listId) {
  return Channel
    .findByIdAndUpdate(
      channelId,
      {
        $pull: {
          saved_lists: listId,
        },
      },
      {
        new: true,
      },
    )
    .select('-password')
    .exec()
    .then(updated => updated.toObject);
};

// only for auth
const getPassword = function getChannelPassword(id) {
  return Channel
    .findById(id)
    .select('password')
    .exec()
    // extract password from channel
    .then((channel) => {
      if (!channel) throw new Error('Channel not found');
      return channel.password;
    });
};

module.exports.get = get;
module.exports.add = add;
module.exports.remove = remove;
module.exports.update = update;
module.exports.follow = follow;
module.exports.unfollow = unfollow;
module.exports.saveList = saveList;
module.exports.unsaveList = unsaveList;
module.exports.getPassword = getPassword;

const mongoose = require('mongoose');

const List = require('./list');

const { Schema } = mongoose;

const Channel = new Schema({
  _id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  saved_lists: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'List',
    }],
    default: [],
  },
  following: {
    type: [{
      type: String,
      ref: 'Channel',
    }],
    default: [],
  },
}, { toObject: { getters: true } });

Channel.pre(
  'remove',
  (document) => {
    List
    // remove channel lists
      .remove({
        owner: document.id,
      })
      .exec()
    // remove channel from other's following
      .then(() => (
        Channel
          .update(
            {
              following: {
                $elemMatch: {
                  $eq: document._id,
                },
              },
            },
            {
              $pull: {
                following: document._id,
              },
            },
            {
              multi: true,
            },
          ).exec()
      ))
      .then(() => {
        console.log('channel cascade delete successful');
      })
      .catch((error) => {
        console.log('channel cascade delete failed');
        console.log(error);
      });
  },
);

module.exports = mongoose.model('Channel', Channel);

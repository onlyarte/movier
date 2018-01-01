const mongoose = require('mongoose');

const { Schema } = mongoose;

const Channel = require('./channel');

const List = new Schema({
  owner: {
    type: String,
    ref: 'Channel',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  films: {
    type: [String],
    required: true,
  },
  updated: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, { toObject: { getters: true } });

List.pre(
  'remove',
  (document) => {
    Channel
    // remove list from channels' saved_lists
      .update(
        {
          saved_lists: {
            $elemMatch: {
              $eq: document._id,
            },
          },
        },
        {
          $pull: {
            saved_lists: document._id,
          },
        },
        {
          multi: true,
        },
      ).exec();
  },
);

module.exports = mongoose.model('List', List);

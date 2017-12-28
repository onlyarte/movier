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
});

Channel.pre(
  'remove',
  (document) => {
    List.remove({
      owner: document.id,
    }).exec();
  },
);

module.exports = mongoose.model('Channel', Channel);

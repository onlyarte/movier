const mongoose = require('mongoose');

const { Schema } = mongoose;

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
});

List.pre('save', (next) => {
  this.updated = Date.now();
  next();
});

module.exports = mongoose.model('List', List);

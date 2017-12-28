const mongoose = require('mongoose');

const { Schema } = mongoose;

const listSchema = new Schema({
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
});

module.exports = mongoose.model('List', listSchema);

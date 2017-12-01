const mongoose  = require('mongoose')
const Schema    = mongoose.Schema;

const listSchema = new Schema({
    owner: { type: String, ref: 'Channel' },
    is_open: Boolean,
    name: String,
    cover: String,
    films: [String],
});

module.exports = mongoose.model('List', listSchema);

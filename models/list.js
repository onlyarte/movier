const mongoose  = require('mongoose')
const Schema    = mongoose.Schema;

const listSchema = new Schema({
    owner: { type: String, ref: 'Channel' },
    is_open: Boolean,
    name: String,
    films: [{ type: String, ref: 'Film' }],
});

module.exports = mongoose.model('List', listSchema);

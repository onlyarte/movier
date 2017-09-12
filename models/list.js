// The List model

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let listSchema = new Schema({
    _owner: { type: String, ref: 'Channel' },
    _is_open: Boolean,
    _name: String,
    _films: [{ type: Number, ref: 'Film' }]
});

module.exports = mongoose.model('List', listSchema);

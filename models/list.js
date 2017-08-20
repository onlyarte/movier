// The List model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var listSchema = new Schema({
    _owner: { type: String, ref: 'Channel' },
    _is_open: Boolean,
    _name: String,
    _films: [{ type: Number, ref: 'Film' }]
});

module.exports = mongoose.model('List', listSchema);

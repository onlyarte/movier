// The Film model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var filmSchema = new Schema({
    _id: Number,
    _title: String,
    _title_original: String,
    _is_full: Boolean, // false if only id and titles added to implement search
    _poster: String,
    _year: Number,
    _country: String,
    _genre: String,
    _directors: [String],
    _writers: [String],
    _actors: [String],
    _description: String
});

module.exports = mongoose.model('Film', filmSchema);

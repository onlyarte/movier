// The Film model

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let filmSchema = new Schema({
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
    _description: String,
    _rating_kp: Number,
    _rating_imdb: Number
});

module.exports = mongoose.model('Film', filmSchema);

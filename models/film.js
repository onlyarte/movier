const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const filmSchema = new Schema({
    id: String,
    title: String,
    poster: String,
    year: Number,
    country: String,
    genre: String,
    directors: [String],
    writers: [String],
    actors: [String],
    description: String,
    rating: Number,
});

module.exports = mongoose.model('Film', filmSchema);

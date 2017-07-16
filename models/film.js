// The Film model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var filmSchema = new Schema({
    id: Number,
    title: String,
    title_original: String,
    year: Number,
    country: [String],
    genre: [String],
    director: [ObjectId],
    actors: [ObjectId],
    kp: Number,
    fb: Number
});

module.exports = mongoose.model('Film', filmSchema);

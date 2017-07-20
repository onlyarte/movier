// The Film model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//var connection = mongoose.createConnection('mongodb://purii:ruslan16@ds161012.mlab.com:61012/filmbase');

var filmSchema = new Schema({
    _id: Number,
    _title: String,
    _title_original: String,
    _poster: String,
    _year: Number,
    _country: [String],
    _genre: [String],
    _director: [Number],
    _actors: [Number],
    _description: String
});

module.exports = mongoose.model('Film', filmSchema);

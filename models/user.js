// The User model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var connection = mongoose.createConnection('mongodb://purii:ruslan16@ds161012.mlab.com:61012/filmbase');

var userSchema = new Schema({
    _id: String,
    _email: String,
    _name: String,
    _image: String,
    _films: {
        _favs: [{ type: Number, ref: 'Film' }],
        _watchlist: [{ type: Number, ref: 'Film' }],
        _watched: [{ type: Number, ref: 'Film' }]
    }
});

module.exports = connection.model('User', userSchema);

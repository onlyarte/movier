// The Person model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var personSchema = new Schema({
    id: Number,
    name: String,
    birth: Date,
    roles: [String],
    films: [ObjectId]
});

module.exports = mongoose.model('Person', personSchema);

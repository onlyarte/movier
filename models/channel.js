const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const channelSchema = new Schema({
    _id: String,
    email: String, //for access recovering
    password: String,
    name: String,
    image: String,
    saved_lists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
    following: [{ type: String, ref: 'Channel' }],
});

module.exports = mongoose.model('Channel', channelSchema);

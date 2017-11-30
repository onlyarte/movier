const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const channelSchema = new Schema({
    id: String,
    email: String, //for access recovering
    password: String,
    name: String,
    image: String,
    saved_lists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
});

module.exports = mongoose.model('Channel', channelSchema);

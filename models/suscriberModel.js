let mongoose = require('mongoose');
let suscriberSchema = mongoose.Schema({

    email: {
        type: String,
    }

}, { timestamps: true });
module.exports = mongoose.model('Contact', suscriberSchema);
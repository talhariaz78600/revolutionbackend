let mongoose = require('mongoose');


let mediaSchema = mongoose.Schema({
    twitterUrl: {
        type: String,
    },
    facebookUrl: {
        type: String,
    },
    telegramUrl: {
        type: String,
    },
    instagramUrl: {
        type: String,
    }
}, { timestamps: true });
module.exports = mongoose.model('Media', mediaSchema);
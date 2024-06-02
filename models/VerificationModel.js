let mongoose = require('mongoose');
const bcrypt = require('bcrypt');


let VerificationSchema = mongoose.Schema({
    email: {
        type: String,
    },
    expirationTime: {
        type: String,
    }

}, { timestamps: true });
module.exports = mongoose.model('Verification', VerificationSchema);


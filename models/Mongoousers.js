let mongoose = require('mongoose');
const bcrypt = require('bcrypt');


let userSchema = mongoose.Schema({
    firstname:{
        type:String,
    },
    lastname:{
        type:String,
    },
    email: {
        type: String,
    },
    mobileNumber: {
        type: String,
    },
    password: {
        type: String,
    },
    address:{
        type:String,
    },
    status: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
    },
    sessionExpiration: {
        type: String,
    },
    jwttoken: {
        type: String,
    },
    lastLogin: {
        type: Date,

    },

}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);





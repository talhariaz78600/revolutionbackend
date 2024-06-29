let mongoose = require('mongoose');
let contactSchema = mongoose.Schema({
    Name:{
        type:String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
    },
    message: {
        type: String,
    }
}, { timestamps: true });
module.exports = mongoose.model('Message', contactSchema);

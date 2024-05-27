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
    },
    productId:{
        type:String
    },
    numberProduct:{
        type:Number,
    },
    status: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });
module.exports = mongoose.model('Contact', contactSchema);

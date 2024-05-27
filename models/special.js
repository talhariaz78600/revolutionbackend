let mongoose = require('mongoose');
const bcrypt = require('bcrypt');
let spicalSchema = mongoose.Schema({
    title:{
        type:String,
    },
    price: {
        type: Number,
    },
    imageUrl: {
        type: String,
    },
    condition:{
        type:String
    },
    power:{
        type:String
    },
    machines:{
        type:String
    },
    hostingfee:{
    type:Number
    },
    data:{
        type: Date,
        default: Date.now
    }

}, { timestamps: true });
module.exports = mongoose.model('Specialproduct', spicalSchema);
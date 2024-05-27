let mongoose = require('mongoose');
const bcrypt = require('bcrypt');
 let commentSchema=mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    comment:{
        type:String
    }
 })

let blogSchema = mongoose.Schema({
    title:{
        type:String,
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    comments:[commentSchema],
    data:{
        type: Date,
        default: Date.now
    }

}, { timestamps: true });
module.exports = mongoose.model('Blog', blogSchema);

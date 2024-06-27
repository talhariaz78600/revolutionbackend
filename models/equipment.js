let mongoose = require('mongoose');
let EquipmentSchema = mongoose.Schema({
    producttype: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    title: {
        type: String,
    },
    price: {
        type: Number,
    },
 
    power: {
        type: String
    },
    machines: {
        type: String
    },
    hostingfee: {
        type: Number
    },
    monthlysupport:{
        type:Number
    },
    installation:{
        type:Number
    },
    condition: {
        type: String
    },
    data: {
        type: Date,
        default: Date.now
    },
    deposit:{
        type:Number
    },
    status: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });
module.exports = mongoose.model('Equipmentproduct', EquipmentSchema);
let mongoose = require('mongoose');
let EquipmentSchema = mongoose.Schema({
    producttype: {
        type: String,
    },
    title: {
        type: String,
    },
    price: {
        type: Number,
    },
    imageUrl: {
        type: String,
    },
    condition: {
        type: String
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
    data: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });
module.exports = mongoose.model('Equipmentproduct', EquipmentSchema);
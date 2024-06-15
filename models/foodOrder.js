let mongoose = require('mongoose');
let productdetail=mongoose.Schema({
    Id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipmentproduct',
    }
});
let orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: [productdetail],
  noofitems: {
    type: String,
  },
  title: {
    type: String
  },
  price: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });
module.exports = mongoose.model('productorder', orderSchema);
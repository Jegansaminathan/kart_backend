let mongoose = require('mongoose');
let OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required:true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required:true },
        quantity: { type:Number,required:true },
        price: { type:Number,required:true },
    }],
    totalAmount: Number,
    fraud: Number,
    paymentMethod: String,
    orderStatus: { type: String, default: 'Pending' },
    orderDate: { type: Date, default: Date.now },
    shippingAddress: String,
})
ordermodel = mongoose.model('order', OrderSchema)
module.exports = ordermodel;
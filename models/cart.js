let mongoose = require('mongoose');
let CartSchema = new mongoose.Schema({
    userId: { type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    items:[{
        productId: { type:mongoose.Schema.Types.ObjectId,ref:'product',required:true},
        quantity: { type:Number,required:true,default:1 },
    }],
},{timestamps:true});
cartmodel = mongoose.model('cart', CartSchema)
module.exports = cartmodel;
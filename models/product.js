let mongoose=require('mongoose');
let ProdSchema=new mongoose.Schema({
    name:String,
    category:String,
    price:Number,
    stock:Number,
    image:String,
})
productmodel=mongoose.model('product',ProdSchema)
module.exports=productmodel;

let mongoose= require('mongoose');

let InteractionSchema=new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required:true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required:true },
    interactionType: { type: String, enum: ['view','add_to_cart','update_cart','purchase'],required:true },
},{timestamps:true})

interactionmodel=mongoose.model('interaction',InteractionSchema)
module.exports=interactionmodel;
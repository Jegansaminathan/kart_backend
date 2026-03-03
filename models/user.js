let mongoose = require('mongoose');
let Userschema= new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    role: {type: String, default: "user"},
    gender: String,
    location: String,
    deviceType: Number,
},{timestamps:true})
usermodel=mongoose.model('user',Userschema)
module.exports=usermodel;
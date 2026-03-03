let mongoose = require('mongoose');

let mongodb=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB");
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }   
}
module.exports = mongodb;
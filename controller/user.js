const usermodel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let pwdhash=async (pwd)=>{
    let haspwd= await bcrypt.hash(pwd, 10)
    return haspwd;
}
let generateToken=(payload)=>{
    let token=jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:'5hr'})
    return token;
}
let registerUser=async(req,res)=>{
    if(!req.body.name || !req.body.email || !req.body.password || !req.body.gender){
        return res.status(400).send({msg:"Please provide all required fields"})
    }
    try {
        const normalizedEmail = req.body.email.toLowerCase().trim();
        if(await usermodel.findOne({email:normalizedEmail})){
        return res.status(400).send({msg:"User already exists, please login"})
        }
        let password= await pwdhash(req.body.password)
        await usermodel.create({
            name: req.body.name,
            email: normalizedEmail,
            password:password,
            role: req.body.role || "user",
            gender: req.body.gender,
            location: req.body.location,
            deviceType: req.body.deviceType
        })
        res.status(201).send({msg:"User registered successfully"
        })
    }
    catch (error) {
        res.status(500).send({msg:error.message})
    }
}
let loginUser=async(req,res)=>{
    if(!req.body.email || !req.body.password){
        return res.status(400).send({msg:"Please provide email and password"})
    }
    try {
        const normalizedEmail = req.body.email.toLowerCase().trim();
        let user= await usermodel.findOne({email:normalizedEmail})
        if(!user){
            return res.status(400).send({msg:"User not found, please register"})
        }
        let isMatch= await bcrypt.compare(req.body.password,user.password)
        if(!isMatch){
            return res.status(400).send({msg:"Invalid credentials"})
        }
        let token=generateToken({id:user._id,name:user.name,email:user.email,role:user.role})
        res.status(200).send({msg:"Login successful",token})
    }
    catch (error) {
        res.status(500).send({msg:error.message})
    }
}
let getUserData=async(req,res)=>{
    try {
        let user= await usermodel.findById(req.user.id).select("-password")
        if(!user){
            return res.status(404).send({msg:"User not found"})
        }
        res.status(200).send({msg:"User data retrieved successfully",user})
    }
    catch (error) {
        res.status(500).send({msg:error.message})
    }
}
module.exports={registerUser,loginUser,getUserData}
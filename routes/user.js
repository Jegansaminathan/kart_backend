let express=require('express')
let urouter=express.Router()
let {registerUser,loginUser,getUserData}=require('../controller/user')
const protect = require('../middleware/protect')
urouter.post('/register',registerUser)
urouter.post('/login',loginUser)
urouter.get('/getuser',protect,getUserData)
module.exports=urouter
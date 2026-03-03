let express=require('express');
require('dotenv').config();
let cors=require('cors');
let mongodb=require('./config/connect');
let urouter=require('./routes/user');
let prouter=require('./routes/product');
let crouter=require('./routes/cart');
let orouter=require('./routes/order');

let app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/images",express.static('images'));
app.use(cors());

app.use('/user',urouter);
app.use('/product',prouter);
app.use('/cart',crouter);
app.use('/order',orouter);

mongodb().then(()=>{
    app.listen(process.env.PORT,()=>{
    console.log("Database connected successfully and server is running on port", process.env.PORT);
    })
}).catch((err)=>{
    console.log("Database connection failed", err);
    process.exit(1);
})
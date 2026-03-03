let express= require("express");
let orouter = express.Router();
let { createorder, getorders } = require("../controller/order");
const protect = require("../middleware/protect");
orouter.post("/create", protect, createorder);
orouter.get("/get", protect, getorders);
module.exports = orouter;
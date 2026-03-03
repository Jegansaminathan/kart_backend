let express = require("express");
let crouter = express.Router();
let { createcart, getcart, removecartitem, updatecartitem, clearcart } = require("../controller/cart");
const protect = require("../middleware/protect");

crouter.post("/add", protect, createcart);
crouter.get("/get", protect, getcart);
crouter.delete("/remove", protect, removecartitem);
crouter.put("/update", protect, updatecartitem);
crouter.put("/clear", protect, clearcart);

module.exports = crouter;
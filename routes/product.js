const express = require("express");
let prouter = express.Router();
let {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  updateProduct,
  deleteProduct,
} = require("../controller/product");
const protect = require("../middleware/protect");
const upload = require("../middleware/multerupload");

prouter.get("/all/:page", getAllProducts);
prouter.get("/category/:category/:page", getProductsByCategory);
prouter.get("/search",searchProducts);

prouter.get("/single/:id",protect,getProductById);

prouter.post("/add", protect, upload.single("image"), createProduct);
prouter.put("/update/:id", protect, upload.single("image"), updateProduct);
prouter.delete("/delete/:id", protect, deleteProduct);

module.exports = prouter;

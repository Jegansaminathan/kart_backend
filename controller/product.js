let productmodel = require('../models/product');
let interactionmodel = require("../models/interaction");
let fs = require('fs').promises;
const path = require("path");

let createProduct = async (req, res) => {
    try {

        let product = new productmodel({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            stock: req.body.stock,
            image: req.file ? req.file.path : null
        });
        await product.save();
        res.status(201).send({ msg: "Product created successfully", product });
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
};

let getAllProducts = async (req, res) => {
    try {
        
        let products = await productmodel.find().skip((req.params.page - 1) * 20).limit(20);
        res.status(200).send({ msg: "Products retrieved successfully", products });
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
};

let getProductById = async (req, res) => {
    try {
        let product = await productmodel.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ msg: "Product not found" });
        }
        if(req.user){
            interactionmodel.create({userId: req.user.id,productId: req.params.id,interactionType: 'view'}).then(() => {
                console.log("Interaction logged successfully");
            }).catch((err) => {
                console.error("Failed to log interaction:", err);
            });
        }
        res.status(200).send({ msg: "Product retrieved successfully", product });
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
};

let getProductsByCategory = async (req, res) => {
    try {
        let products = await productmodel.find({ category: req.params.category}).skip((req.params.page - 1) * 20).limit(20);
        res.status(200).send({ msg: "Products retrieved successfully", products });
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
}

let searchProducts = async (req, res) => {
    try {
        let filter = {};
        if(req.query.query){
        let cleanquery = req.query.query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        let regex = new RegExp('^' + cleanquery, 'i');
        filter.name = regex;
        }
        if(req.query.minprice||req.query.maxprice){
            filter.price = {};
            if(req.query.minprice){
                filter.price.$gt = parseInt(req.query.minprice);
            }
            if(req.query.maxprice){
                filter.price.$lt = parseInt(req.query.maxprice);
            }
        }
        let products = await productmodel.find(filter).sort({ price: req.query.sortorder === 'asc' ? 1 : -1 }).skip((req.query.page - 1) * 20).limit(20);
        res.status(200).send({ msg: "Products retrieved successfully", products });
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
}

let updateProduct = async (req, res) => {
    try{
        let product =await productmodel.findById(req.params.id);
        if(!product){
            return res.status(404).send({msg:"Product not found"});
        }
        product.name = req.body.name ?? product.name;
        product.category = req.body.category ?? product.category;
        product.price = req.body.price ?? product.price;
        product.stock = req.body.stock ?? product.stock;
        if(req.file){
            const oldimg=product.image;
            product.image = req.file.path;
            if(oldimg){
                try{
                    const fulloldpath=path.resolve(oldimg);
                    await fs.unlink(fulloldpath);
                }catch(err){
                    console.error("Failed to delete old image:", err);
                }
        }
    }
    await product.save();
    res.status(200).send({msg:"Product updated successfully", product});
    }
    catch(error){
        res.status(500).send({msg:error.message});  
    }
}

let deleteProduct = async (req, res) => {
    try{
        let product =await productmodel.findById(req.params.id);
        if(!product){
            return res.status(404).send({msg:"Product not found"});
        }
        if(product.image){
            try{
                let fullpath=path.resolve(product.image);
                await fs.unlink(fullpath);
            }catch(err){
                console.error("Failed to delete product image:", err);
            }
        }
        await productmodel.findByIdAndDelete(req.params.id);
        res.status(200).send({msg:"Product deleted successfully"});
    }
    catch(error){
        res.status(500).send({msg:error.message});
    }
}

module.exports = { createProduct, getAllProducts, getProductById ,getProductsByCategory, searchProducts, updateProduct, deleteProduct }

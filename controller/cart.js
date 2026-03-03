const cartmodel = require("../models/cart");
const productmodel = require("../models/product");
const interactionmodel = require("../models/interaction");

let createcart = async (req, res) => {
    try {
        if(req.user.role !== 'user'){
            return res.status(403).send({ msg: "Access denied. Only users can access cart." });
        }
        let cart = await cartmodel.findOne({ userId: req.user.id });
        if (cart) {
            if(cart.items.some(item => item.productId.toString() === req.body.productId.toString())){
                return res.status(400).send({ msg: "Product already in cart" });
            }
            else{
                let prod = await productmodel.findById(req.body.productId);
                if(!prod){
                    return res.status(404).send({ msg: "Product not found" });
                }
                if(prod.stock < req.body.quantity || req.body.quantity < 1){
                    cart.availablestock= prod.stock;
                    await cart.save();
                    return res.status(400).send({ msg: "Product out of stock" });
                }
                cart.items.push({ productId: req.body.productId, quantity: req.body.quantity || 1 });
                await cart.save();
                await interactionmodel.create({userId: req.user.id,productId: req.body.productId,interactionType: 'add_to_cart'});
                return getcart(req, res);
            }
        }
        else {
            let prod = await productmodel.findById(req.body.productId);
            if(!prod){
                return res.status(404).send({ msg: "Product not found" });
            }
            if(prod.stock < req.body.quantity){
                return res.status(400).send({ msg: "Product out of stock" });
            }
            cart = new cartmodel({
                userId: req.user.id,
                items: [{ productId: req.body.productId, quantity: req.body.quantity || 1 }]
            });
            await cart.save();
            await interactionmodel.create({userId: req.user.id,productId: req.body.productId,interactionType: 'add_to_cart'});
            return getcart(req, res);
        }
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
};

let getcart = async (req, res) => {
    try {
        let cart = await cartmodel.findOne({ userId: req.user.id }).populate('items.productId');
        if (!cart) {
            return res.status(404).send({ msg: "Cart not found" });
        }
        let total = 0;
        let items = cart.items.map(item => {
            let prod = item.productId;
             if (!prod) return null;
             const price=Number(prod.price)||0;
             const quantity=Number(item.quantity)||0;
             const subtotal=price*quantity;
             const available = prod.stock >= item.quantity? true : false;
             total += subtotal;
            return {
                product: prod._id,
                name: prod.name,
                image: prod.image,
                quantity: quantity,
                avastock: prod.stock,
                price: price,
                available: available,
                subtotal: subtotal
                }
            }
        ).filter(Boolean);
        res.status(200).send({ msg: "Cart retrieved successfully", items,total, cartlength:items.length});
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
};

let removecartitem = async (req, res) => {
    try {
        let cart = await cartmodel.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).send({ msg: "Cart not found" });
        }
        cart.items = cart.items.filter(item => item.productId.toString() !== req.body.productId.toString());
        await cart.save();
        return getcart(req, res);
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
};

let updatecartitem = async (req, res) => {
    try {
        let cart = await cartmodel.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).send({ msg: "Cart not found" });
        }
        let item = cart.items.find(item => item.productId.toString() === req.body.productId.toString());
        if (!item) {
            return res.status(404).send({ msg: "Product not found in cart" });
        }
        if(req.body.quantity < 1){
            cart.items = cart.items.filter(item => item.productId.toString() !== req.body.productId.toString());
            await cart.save();
            return getcart(req, res);
        }
        else{
            let prod = await productmodel.findById(req.body.productId);
            if(!prod){
                return res.status(404).send({ msg: "Product not found" });
            }
            if(prod.stock < req.body.quantity){
                cart.availablestock= prod.stock;
                await cart.save();
                return res.status(400).send({ msg: "Product out of stock", availableStock: prod.stock });
            }
            item.quantity = req.body.quantity;
            await cart.save();
            await interactionmodel.create({userId: req.user.id,productId: req.body.productId,interactionType: 'update_cart'});
            return getcart(req, res);
        }
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
};

let clearcart = async (req, res) => {
    try {
        let cart = await cartmodel.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).send({ msg: "Cart not found" });
        }
        cart.items = [];
        await cart.save();
        res.status(200).send({ msg: "Cart cleared successfully", cart });
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
};


module.exports = { createcart, getcart, removecartitem, updatecartitem, clearcart};
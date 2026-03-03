let ordermodel=require('../models/order');
let cartmodel = require("../models/cart");
let productmodel = require("../models/product");
let interactionmodel = require("../models/interaction");

let createorder = async (req, res) => {
    try {
        let cart = await cartmodel.findOne({ userId: req.user.id }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(404).send({ msg: "Cart not found or is empty" });
        }
        let totalAmount = 0;
        for (let item of cart.items) {
            if(item.productId.stock < item.quantity){
                return res.status(400).send({ msg: `Product ${item.productId.name} available stock is ${item.productId.stock}` });
            }
            totalAmount += item.productId.price * item.quantity;
        }
        let order = new ordermodel({
            userId: req.user.id,
            items: cart.items.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price
            })),
            totalAmount: totalAmount,
            paymentMethod: req.body.paymentMethod,
            shippingAddress: req.body.shippingAddress
        });

        for (let item of cart.items) {
            await productmodel.findByIdAndUpdate({_id:item.productId._id,stock:{$gte:item.quantity}}, { $inc: { stock: -item.quantity } });
        }

        await order.save();

        for (let item of cart.items) {
            await interactionmodel.create({
                userId: req.user.id,
                productId: item.productId._id,
                interactionType: "purchase"
            });
        }
        
        cart.items = [];
        await cart.save();
        res.status(201).send({ msg: "Order created successfully", order });
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
};

let getorders = async (req, res) => {
    try {
        let orders = await ordermodel.find({ userId: req.user.id }).populate('items.productId');
        res.status(200).send({ msg: "Orders retrieved successfully", orders });
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
};


module.exports = { createorder, getorders };
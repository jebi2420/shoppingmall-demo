const Cart= require("../models/Cart");
const Product = require('../models/Product');

const cartController = {};

cartController.addItemToCart = async (req, res) => {
    try{
        const {userId} = req; // authenticate로 부터 온 userId
        const {productId, size, qty} = req.body;
        // 유저를 가지고 카트 찾기
        let cart = await Cart.findOne({userId});
        if(!cart){
            // 유저가 만든 카트가 없으면 만들어주기
            cart = new Cart({userId});
            await cart.save();
        }
        // 이미 카트에 들어가있는 아이템이냐? (productId로만 따지기에는 size가 여러개일 수 있다)
        const existItem = cart.items.find((item)=>
        item.productId.equals(productId) && item.size === size);
        // 그렇다면 에러 ("이미 카트에 들어간 아이템입니다")
        if(existItem){
            throw new Error("아이템이 이미 카트에 담겨 있습니다"); // 이미 담은 상품의 수량을 추가했습니다 (옵션)
        }
        // 카트에 아이템을 추가
        cart.items = [...cart.items, { productId, size, qty }];
        await cart.save();
        
        res.status(200).json({
            status: "success", 
            data: cart, cartItemQty: cart.items.length
        });

    }catch(error){
        res.status(400).json({status: "fail", error: error.message});
    }
}

cartController.getCartList = async (req, res) => {
    try{
        const {userId} = req;
        let cart = await Cart.findOne({userId}).populate({
            path: "items",
            populate: {
                path: "productId",
                model: "Product"
            }
        });
        res.status(200).json({status: "success", data: cart.items});

    }catch(error){
        res.status(400).json({status: "fail", error: error.message});
    }
}

cartController.deleteCartList = async (req, res) => {
    try{
        const {userId} = req;
        const productId = req.params.id; 
        const productSize = req.params.size; 

        let cart = await Cart.findOne({userId}).populate({path: "items"});
        cart.items = cart.items.filter((item)=>
        !(item.productId.equals(productId) && item.size === productSize)
        );

        await cart.save();

        res.status(200).json({status: "success", data: cart.items});
    }catch(error){
        res.status(400).json({status: "fail", error: error.message});
    }
}

cartController.getCartQty = async (req, res) => {
    try {
      const { userId } = req;
      const cart = await Cart.findOne({ userId: userId });
      if (!cart) throw new Error("There is no cart!");
      res.status(200).json({ status: 200, qty: cart.items.length });
    } catch (error) {
      return res.status(400).json({ status: "fail", error: error.message });
    }
  };

cartController.updateCartQty = async (req, res) => {
    try{
        const {userId} = req;
        const productId = req.params.id; 
        const productSize = req.params.size; 
        const productValue = req.params.value;

        // Cart 찾기
        let cart = await Cart.findOne({userId}).populate({path: "items.productId"});
        if(!cart) throw new Error("카트를 찾을 수 없습니다")

        // Product 찾기
        const product = await Product.findById(productId);
        if(!product) throw new Error("상품을 찾을 수 없습니다")

        // 재고 확인
        const availableStock = product.stock[productSize];
        if(productValue > availableStock) throw new Error(`상품의 재고가 부족합니다. (재고:${availableStock})`)

        // Cart 아이템의 수량 업데이트
        let itemUpdated = false;
        cart.items.forEach(item => {
            if (item.productId.equals(productId) && item.size === productSize) {
                item.qty = productValue;
                itemUpdated = true;
            }
        });

        if(!itemUpdated) throw new Error("카트 항목을 찾을 수 없습니다")
        
        await cart.save();

        res.status(200).json({status: "success", data: cart.items});
    }catch(error){
        res.status(400).json({status: "fail", error: error.message});
    }
}

module.exports = cartController;
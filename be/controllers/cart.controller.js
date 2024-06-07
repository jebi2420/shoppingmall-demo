const Cart= require("../models/Cart");

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
        let cart = await Cart.findOne({userId});
        if(!cart) throw new Error("카트가 비어있습니다");
        res.status(200).json({
            status: "success", 
            data: cart
        });

    }catch(error){
        res.status(400).json({status: "fail", error: error.message});
    }
}

module.exports = cartController;
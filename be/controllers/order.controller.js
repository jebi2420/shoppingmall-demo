const productController = require('./product.controller');
const Order = require('../models/Order');
const { randomStringGenerator } = require("../utils/randomStringGenerator");

const orderController = {};

orderController.createOrder = async (req, res) => {
    try{
        // 프론트엔드에서 데이터 보낸거 받아오기
        const { userId } = req;
        const { shipTo, contact, totalPrice, orderList } = req.body;

        // 재고 확인 & 재고 업데이트
        const insufficientStockItems = await productController.checkItemListStock(orderList);

        // 재고가 충분하지 않는 아이템이 있었다 => 에러 
        if(insufficientStockItems.length > 0){
             const errorMessage = 
                insufficientStockItems.reduce((total, item) => (total += item.message), "")
                throw new Error(errorMessage);
        }

        // order를 만들자
        const newOrder = new Order ({
            userId,
            totalPrice,
            shipTo,
            contact, 
            items: orderList,
            orderNum: randomStringGenerator()
        });

        await newOrder.save();
        // save 후에 카트를 비워주자
        res.status(200).json({status: 'success', orderNum: newOrder.orderNum});

    }catch(error){
        res.status(400).json({status: 'fail', error: error.message});
    }
}

orderController.getOrderList = async (req, res) => {
    try{
        const { userId } = req;
        const orderList = await Order.find({userId}).populate({
            path: "items",
            populate: {
                path: "productId",
                model: "Product"
            }
        });
        // if(orderList.length === 0) throw new Error ("주문 리스트가 없습니다")
        res.status(200).json({status: 'success', orderList: orderList});

    }catch(error){
        res.status(400).json({status: 'fail', error: error.message});
    }
}

module.exports = orderController;
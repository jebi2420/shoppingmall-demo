const productController = require('./product.controller');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const { randomStringGenerator } = require("../utils/randomStringGenerator");

const orderController = {};
const PAGE_SIZE = 5;

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
        const {page, ordernum} = req.query;
        const { userId } = req;
        const cond = {
            ...ordernum && { ordernum: { $regex: ordernum, $options: "i" } },
            userId
        };
        
        let query = Order.find(cond).populate({
            path: "items",
            populate: {
                path: "productId",
                model: "Product"
            }
        }).populate({
            path: "userId",
            model: "User"
        });
        let response = { status: "success"};
        if(page){
            query.skip((page-1) * PAGE_SIZE).limit(PAGE_SIZE);
            const totalItemNum = await Order.find(cond).count();
            const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
            response.totalPageNum = totalPageNum;
        }
        const orderList = await query.exec();
        response.data = orderList;
        if(orderList){
            return res.status(200).json(response);
        }
        throw new Error("상품이 없거나 잘못되었습니다");
        // if(orderList.length === 0) throw new Error ("주문 리스트가 없습니다")
        // res.status(200).json({status: 'success', orderList: orderList});

    }catch(error){
        res.status(400).json({status: 'fail', error: error.message});
    }
}

module.exports = orderController;
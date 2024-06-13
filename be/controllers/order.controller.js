const productController = require('./product.controller');
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

// 나의 주문 리스트 가져오기
orderController.getOrder = async (req, res) => {
    try{
        const { userId } = req;

        const orderList = await Order.find({userId}).populate({
            path:"items",
            populate: {
                path: "productId",
                model: "Product",
                select: "image name",
            },
        });
        const totalItemNum = await Order.find({userId}).count();
        const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);

        res.status(200).json({ status: "success", data: orderList, totalPageNum});

    }catch(error){
        res.status(400).json({status: 'fail', error: error.message});
    }
}

// admin 주문 관리 페이지 :  모든 주문 리스트 가져오기
orderController.getOrderList = async (req, res) => {
    try{
        const {page, ordernum} = req.query;
        let cond = {};
        if(ordernum) {
            cond = {
                orderNum: { $regex: ordernum, $options: "i" },
            };
        }
        
        const orderList = await Order.find(cond)
        .populate("userId")
        .populate({
            path: "items",
            populate: {
                path: "productId",
                model: "Product",
                select: "image name",
            },
        })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);

        const totalItemNum = await Order.find(cond).count();
        const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);

        res.status(200).json({ status: "success", data: orderList, totalPageNum });

    }catch(error){
        res.status(400).json({status: 'fail', error: error.message});
    }
}

orderController.updateOrder = async (req, res) => {
    try{
        const orderId = req.params.id;
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            orderId,
            {status},
            {new:true}
        );
        if(!order) throw new Error("주문이 존재하지 않습니다");
        res.status(200).json({status:"success", data: order});
    }catch(error){
        res.status(400).json({status: 'fail', error: error.message});
    }
}

orderController.getOrderDetail = async (req, res) => {
    try{
      const orderId = req.params.id;
      const order = await Order.findById(orderId).populate({
        path: "items",
        populate: {
            path: "productId",
            model: "Product",
            select: "image name",
        },
      })
      .populate({
        path: 'userId',
        model: 'User',
        select: 'name email', 
      });
      
      if(!order) throw new Error("주문이 존재하지 않습니다");
      res.status(200).json({status:"success", data: order});

    }catch(error){
        res.status(400).json({status: 'fail', error: error.message});
    }
}

module.exports = orderController;
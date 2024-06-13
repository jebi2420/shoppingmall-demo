const express = require('express');
const authController = require('../controllers/auth.controller');
const orderController = require('../controllers/order.controller');
const router = express.Router();

// 주문 생성하기
router.post("/", authController.authenticate, orderController.createOrder);
// 나의 주문 가져오기
router.get("/me", authController.authenticate, orderController.getOrder);
// 주문 리스트 가져오기(admin)
router.get("/", authController.authenticate, orderController.getOrderList);
// 주문 상태 수정하기(admin)
router.put("/:id", 
    authController.authenticate, 
    authController.checkAdminPermission, 
    orderController.updateOrder
    );
// 나의 주문 상세 페이지
router.get("/me/:id", authController.authenticate, orderController.getOrderDetail);

module.exports = router;
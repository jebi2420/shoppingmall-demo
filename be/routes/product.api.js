const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const productController = require("../controllers/product.controller");

// 상품 생성
router.post("/", 
    authController.authenticate, // 토큰으로 user 정보 알아내기
    authController.checkAdminPermission, // user가 admin 레벨인지 알아내기
    productController.createProduct); // admin 유저는 상품을 생성할 수 있다

// 상품 보여주기
router.get("/", productController.getProducts);

module.exports = router;
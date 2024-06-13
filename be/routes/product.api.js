const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const productController = require("../controllers/product.controller");

// 상품 생성
router.post("/", 
    authController.authenticate, // 토큰으로 user 정보 알아내기
    authController.checkAdminPermission, // user가 admin 레벨인지 알아내기
    productController.createProduct // admin 유저는 상품을 생성할 수 있다
); 

// 상품 보여주기
router.get("/", productController.getProducts);

// 카테고리별 상품 보여주기
router.get("/:category", productController.getProductsByCategory);

// 상품 디테일 
router.get("/:id", productController.getProductsDetail);

// 상품 수정하기
router.put("/:id", 
    authController.authenticate, 
    authController.checkAdminPermission, 
    productController.updateProduct
);

// 상품 삭제하기
router.put("/delete/:id",
    authController.authenticate, 
    authController.checkAdminPermission, 
    productController.deleteProduct
);

module.exports = router;
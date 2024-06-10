const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const cartController = require("../controllers/cart.controller");

router.post("/", authController.authenticate, cartController.addItemToCart);
router.get("/", authController.authenticate, cartController.getCartList);
router.delete("/:id/:size", authController.authenticate, cartController.deleteCartList);
router.put("/:id/:size/:value", authController.authenticate, cartController.updateCartQty);
router.get("/qty", authController.authenticate, cartController.getCartQty);
module.exports = router;
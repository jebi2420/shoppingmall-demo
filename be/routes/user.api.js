const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");

// 회원가입
router.post("/", userController.createUser);
// 토큰 로그인 : 토큰이 valid한지, token을 가지고 user를 찾아서 return
router.get("/me", authController.authenticate, userController.getUser);

module.exports = router;
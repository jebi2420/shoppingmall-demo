const User = require('../models/User');
const {OAuth2Client} = require('google-auth-library');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const authController = {};

// 이메일로 로그인
authController.loginWithEmail = async(req, res) => {
    try{
        let { email, password } = req.body;
        // 가입된 회원인지 email로 확인
        const user = await User.findOne({email});
        if(user){
            // 비밀번호 일치하는지 확인
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch){
                // token 생성
                const token = await user.generateToken();
                return res.status(200).json({status: "success", user, token});
            }
        }
        throw new Error("이메일 또는 패스워드가 잘못되었습니다");
    }catch(error){
        res.status(400).json({status: "fail", error: error.message});
    }
}

// 구글로 로그인
authController.loginWithGoogle = async(req, res) => {
    try{
        // 토큰 값을 읽어와서 유저 정보를 뽑아내기
        const {token} = req.body
        const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        const { email, name } = ticket.getPayload();
        // 이미 로그인을 한 적이 있는 유저 ⇒ 로그인 시키고, 토큰 값 주면 됨
        let user = await User.findOne({email});
        if(!user){
          // 유저를 새로 생성
          const randomPassword = "" + Math.floor(Math.random()*100000000);
          const salt = await bcrypt.genSalt(10);
          const newPassword = await bcrypt.hash(randomPassword, salt);
          user = new User({
            name,
            email,
            password:newPassword
          })
          await user.save();
        }
        // 토큰 발행 리턴
        const sessionToken = await user.generateToken();
        res.status(200).json({ status: "success", user, token: sessionToken})

    // 처음 로그인 시도를 한 유저 ⇒ 유저 정보 먼저 새로 생성 ⇒ 토큰 값
    }catch(error){
        res.status(400).json({status: "fail", error: error.message});
    }
}


// 토큰이 valid한지 확인 (토큰으로 유저 찾아내기)
authController.authenticate = async (req, res, next) => {
    try{
        const tokenString = req.headers.authorization
        if(!tokenString) throw new Error ("Token not found");
        const token = tokenString.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET_KEY, (error, payload)=>{
            if(error) throw new Error("로그인 해주세요");
            req.userId = payload._id;
        });
        next();
    }catch(error){
        res.status(400).json({status: "fail", error: error.message});
    }
}

// admin 유저인지 확인
authController.checkAdminPermission = async (req, res, next) => {
    try{
        const {userId} = req;
        const user = await User.findById(userId);
        if(user.level !== "admin") throw new Error ("권한이 없습니다");
        next();
    }catch(error){
        res.status(400).json({status: "fail", error: error.message});
    }
}


module.exports = authController;
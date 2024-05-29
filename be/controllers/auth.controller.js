const User = require('../models/User');
const bcrypt = require("bcryptjs");

const authController = {};

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

module.exports = authController;
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const userController = {};

userController.createUser = async(req, res) => {
    try{
        let { email, password, name, level } = req.body;
        // 이미 가입된 user인지 email로 확인
        const user = await User.findOne({email});
        if(user){
            throw new Error("이미 가입된 유저입니다")
        }
        // 패스워드 암호화
        const salt = await bcrypt.genSaltSync(10);
        password = await bcrypt.hash(password, salt);
        // 새로운 User item 생성
        const newUser = new User({ email, password, name, level});
        await newUser.save();
        
        return res.status(200).json({status: "success", message: "회원가입에 성공했습니다!"})

    }catch(error){
        res.status(400).json({status: "fail", message: error.message});
    }
}

module.exports = userController;
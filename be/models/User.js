const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    level: {
        type: String,
        default: "customer" // 2types: customer, admin(관리자)
    }
},{timestamps:true});

// json으로 변환시 필요없는 정보 삭제하는 함수
userSchema.methods.toJSON = function (){
    const obj = this._doc // this._doc = user 데이터 하나
    delete obj.password
    delete obj.__v
    delete obj.updateAt
    delete obj.createAt
    return obj
}

// 토큰을 만드는 함수
userSchema.methods.generateToken = async function(){
    const token = await jwt.sign({_id:this._id}, JWT_SECRET_KEY, {expiresIn:"1d"});
    return token;
}

const User = mongoose.model("User", userSchema);
module.exports = User;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

userSchema.methods.toJSON = function (){
    const obj = this._doc // this._doc = user 데이터 하나
    delete obj.password
    delete obj.__v
    delete obj.updateAt
    delete obj.createAt
    return obj
}

const User = mongoose.model("User", userSchema);
module.exports = User;
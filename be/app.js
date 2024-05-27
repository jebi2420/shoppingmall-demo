const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

require("dotenv").config();
require(cors());
app.unsubscribe(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); // req.body가 객체로 인식된다

// mongoDB 세팅
const mongoURI = process.env.LOCAL_DB_ADDRESS;
mongoose.connect(mongoURI, {useNewUrlParser:true}
    .then(()=>console.log("mongoose connected"))
    .catch((err)=>console.log("DB connection fail", error)));

// port에 서버 오픈
app.listen(process.env.PORT || 5001, ()=>{
    console.log("server on");
})
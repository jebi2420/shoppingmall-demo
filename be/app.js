const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const indexRouter = require("./routes/index");
require("dotenv").config();

const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD;
const LOCAL_DB_ADDRESS = process.env.LOCAL_DB_ADDRESS;

app.use(cors());
app.unsubscribe(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); // req.body가 객체로 인식된다
// /api가 붙은 주소로 오면 indexRouter로 보낸다
app.use("/api", indexRouter);


// mongoDB 세팅
mongoose.connect(MONGODB_URI_PROD, {useNewUrlParser:true})
    .then(()=>console.log("mongoose connected"))
    .catch((err)=>console.log("DB connection fail", error));

// port에 서버 오픈
app.listen(process.env.PORT || 5001, ()=>{
    console.log("server on");
})
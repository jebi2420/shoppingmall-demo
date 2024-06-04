const Product = require("../models/Product");

const productController = {};

productController.createProduct = async (req, res) =>{
    try{
        const {sku, name, size, image, category, description, price, stock, status} = req.body;
        // 모든 필수 정보가 입력되었는지 확인
        if (!sku || !name  || !image || !category || !description || !price || !stock || !status) {
            throw new Error("상품의 정보값을 모두 입력해주세요");
        }
        // sku 중복 방지
        const skuNum = await Product.findOne({sku});
        if(skuNum){
            throw new Error("이미 존재하는 상품입니다")
        }
        const product = new Product({
            sku, 
            name, 
            image, 
            category, 
            description, 
            price, 
            stock, 
            status
        });
        await product.save();
        res.status(200).json({status:"success", product})

    }catch(error){
        res.status(400).json({status:"fail", error: error.message})
    }
}

productController.getProducts = async (req, res)=>{
    try{
        const {page, name} = req.query;
        const cond = name?{name:{$regex:name, $options:"i"}}:{}
        let query = Product.find(cond); // 선언
        const productList = await query.exec(); // 실행

        if(productList){
            return res.status(200).json({status: "success", data : productList});
        }
        throw new Error("상품이 없거나 잘못되었습니다");
    }catch(error){
        res.status(400).json({status: "fail", error: error.message});
    }
}

module.exports = productController;
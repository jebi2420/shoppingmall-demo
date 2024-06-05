const Product = require("../models/Product");

const productController = {};

const PAGE_SIZE = 3;

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
        let response = { status: "success"};
        if(page){
            query.skip((page-1) * PAGE_SIZE).limit(PAGE_SIZE);
            // 최종 몇개 페이지
            // 데이터가 총 몇개 있는지
            const totalItemNum = await Product.find(cond).count();
            // 데이터 총 개수 / PAGE_SIZE
            const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
            response.totalPageNum = totalPageNum;
        }
        const productList = await query.exec(); // 실행
        response.data = productList;
        if(productList){
            return res.status(200).json(response);
        }
        throw new Error("상품이 없거나 잘못되었습니다");
    }catch(error){
        res.status(400).json({status: "fail", error: error.message});
    }
}

productController.updateProduct = async (req, res) => {
    try{
        const productId = req.params.id; 
        const {sku, name, size, image, category, description, price, stock, status} = req.body;
        const product = await Product.findByIdAndUpdate(
            {_id: productId},
            {sku, name, size, image, category, description, price, stock, status},{new:true}
        );
        if(!product) throw new Error("상품이 존재하지 않습니다");
        res.status(200).json({status:"success", data: product})    
    }catch(error){
        res.status(400).json({status: "fail", error: error.message});
    }
}

module.exports = productController;
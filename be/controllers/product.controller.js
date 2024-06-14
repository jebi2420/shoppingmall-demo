const Product = require("../models/Product");
const mongoose = require('mongoose');

const productController = {};

const PAGE_SIZE = 5;

// 상품 생성
productController.createProduct = async (req, res) =>{
    try{
        const {sku, name, size, image, category, description, price, stock, status} = req.body;
        // 모든 필수 정보가 입력되었는지 확인
        if (!sku || !name || !image || !category || !description || !price || !stock || !status) {
            throw new Error("상품의 정보값을 모두 입력해주세요");
        }
        // sku 중복 방지
        const skuNum = await Product.findOne({sku});
        if(skuNum){
            throw new Error("이미 존재하는 상품번호(sku)입니다")
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

// 상품 전체 리스트 가져오기
productController.getProducts = async (req, res)=>{
    try{
        const {page, name, menu} = req.query;
        const cond = {
            ...name && { name: { $regex: name, $options: "i" } },
            isDeleted: false,
            ...(menu && { category: menu.toLowerCase()}) // menu가 있는 경우만 카테고리별로 보여주기
        };

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
        response.menu = menu;
        if(productList){
            return res.status(200).json(response);
        }
        throw new Error("상품이 없거나 잘못되었습니다");
    }catch(error){
        res.status(400).json({status: "fail", error: error.message});
    }
}

// 상품 디테일 가져오기
productController.getProductsDetail = async (req, res) => {
    try{
        const productId = req.params.id; 
        const product = await Product.findById(productId);
        if(!product) throw new Error("상품이 존재하지 않습니다");
        res.status(200).json({status:"success", data: product}) 
    }catch(error){
        res.status(400).json({status: "fail", error: error.message});
    }
}

// 상품 수정
productController.updateProduct = async (req, res) => {
    try{
        const productId = req.params.id; 
        const {sku: newSku, name, size, image, category, description, price, stock, status} = req.body;
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            throw new Error("상품이 존재하지 않습니다");
        }
        // sku 중복 방지 - 수정한 sku 값이 이전 값과 다를 때만 중복 검사 수행
        if(newSku !== existingProduct.sku){
            const skuNum = await Product.findOne({sku: newSku});
            if(skuNum) throw new Error("이미 존재하는 상품번호(sku)입니다")
        }
        const product = await Product.findByIdAndUpdate(
            productId,
            {sku: newSku, name, size, image, category, description, price, stock, status},
            {new:true}
        );
        
        res.status(200).json({status:"success", data: product})    
    }catch(error){
        res.status(400).json({status: "fail", error: error.message});
    }
}

// 상품 삭제
productController.deleteProduct = async (req, res) => {
    try{
        const productId = req.params.id; 
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error("유효하지 않은 상품 ID입니다");
        }
        const product = await Product.findByIdAndUpdate(
            productId,
            { $set: { isDeleted: true } },
            { new: true }
        );
        if(!product) throw new Error("상품이 존재하지 않습니다");
        res.status(200).json({status:"success", data: product})     
    }catch(error){
        res.status(400).json({status: "fail", error: error.message});
    }
}
// 상품 재고 정보 
productController.checkStock = async (item) => {
    // 내가 사려는 아이템 재고 정보 들고오기
    const product = await Product.findById(item.productId);
    // 내가 사려는 아이템 qty, 재고 비교
    if(product.stock[item.size] < item.qty){
        // 재고가 불충분하면 불충분 메시지와 함께 데이터 반환
        return {
            isVerify: false, // 불통과
            message:`${product.name}의 ${item.size}재고가 부족합니다`
        }
    }
    // 충분하다면, 재고에서 -qty 성공
    const newStock = {...product.stock};
    newStock[item.size] -= item.qty;
    product.stock = newStock;

    await product.save();
    
    return {isVerify: true} // 통과
}

productController.checkItemListStock = async (itemList) => {
    try{
        // Product DB에서 _id가 item.ProductId와 일치하는 상품들을 배열 형태로 products에 저장
        const products = await Product.find({
            _id: { $in: itemList.map((item) => item.productId) },
        });

        // products 배열 -> productMap 객체 형태로 변환 : 빠른 데이터 조회를 위함
        const productMap = products.reduce((map, product) => {
            map[product._id] = product;
            return map;
        }, {});

        const insufficientStockItems = itemList
            // 주문한 수량 보다 재고가 모자란 item을 모은 새로운 배열 생성
            .filter((item) => {
                // product안에 item.productId를 키값으로 가진 상품 정보 담기
                const product = productMap[item.productId];
                return product.stock[item.size] < item.qty; // 재고가 부족한 경우 true를 반환하고 해당 item을 새로운 배열에 유지
            })
            // 재고가 부족한 item배열을 객체 배열로 매핑 (재고부족 아이템, 그에대한 메시지로 구성)
            .map((item) => {
                return {
                    item,
                    message: `${productMap[item.productId].name}의 ${item.size} 재고가 부족합니다`
                }
            });
        return insufficientStockItems;
    }catch(error){
        throw new Error("재고 확인 중 오류가 발생했습니다.");
    }
}

productController.deductItemStock = async (itemList) => {
  try {
    await Promise.all(
      itemList.map(async (item) => {
        const product = await Product.findById(item.productId);
        console.log("빼기전", product)
        if (!product) {
          throw new Error(
            `ID에 해당하는 제품을 찾을 수 없습니다: ${item.productId}`
          );
        }
        product.stock[item.size] -= item.qty;
        console.log("뺸거", product)
        // return product.save();
        try {
          // 저장 후의 결과를 로그로 확인
          const savedProduct = await product.save();
          console.log('Product saved successfully:', savedProduct);
          return savedProduct;
        } catch (error) {
          console.error('Error saving product:', error);
          throw new Error('제품 저장에 실패했습니다.');
        }
      })
    );
  } catch (error) {
    console.error("Overall error during stock update:", error);
    throw new Error("제품 재고 업데이트에 실패했습니다.");
  }
};


module.exports = productController;
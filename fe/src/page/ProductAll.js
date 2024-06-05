import React, { useEffect, useState } from "react";
import ProductCard from "../component/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../action/productAction";
import { commonUiActions } from "../action/commonUiAction";

const ProductAll = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.product.error);
  const { productList } = useSelector(state=>state.product);
  const [query, setQuery] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  }); 

  // 처음 로딩하면 상품리스트 불러오기
  useEffect(()=>{
    dispatch(productActions.getProductList({...searchQuery}));
  },[query]);

  useEffect(() => {
    //검색어나 페이지가 바뀌면 url바꿔주기 (검색어 또는 페이지가 바뀜 => url 바꿔줌=> 
    //url쿼리 읽어옴 => 이 쿼리값 맞춰서  상품리스트 가져오기)
    if(searchQuery === ""){
      delete searchQuery.name;
    }
    console.log("searchQuery:", searchQuery)
    const params = new URLSearchParams(searchQuery);
    const query = params.toString();
    navigate("?" + query);
  }, [searchQuery]);

  return (
    <Container>
      <Row>
        {productList.map((item, index) => (
          <Col key={index} md={3} sm={12}>
            <ProductCard item={item}/>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductAll;

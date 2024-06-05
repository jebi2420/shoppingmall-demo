import React, { useEffect, useState } from "react";
import ProductCard from "../component/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../action/productAction";
import { commonUiActions } from "../action/commonUiAction";

const ProductAll = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.product.error);
  const { productList } = useSelector(state=>state.product);
  const [query, setQuery] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  }); //검색 조건들을 저장하는 객체

  // 처음 로딩하면 상품리스트 불러오기
  useEffect(()=>{
    dispatch(productActions.getProductList({...searchQuery}));
  },[query]);

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

import React, { useEffect, useState } from "react";
import ProductCard from "../component/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../action/productAction";
import { commonUiActions } from "../action/commonUiAction";
import  LoadingSpinner  from "../component/LoadingSpinner";

const ProductAll = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.product.error);
  const { productList } = useSelector(state=>state.product);
  const loading = useSelector((state) => state.product.loading);
  const [query, setQuery] = useSearchParams();
  const name = query.get("name");

  // 처음 로딩하면 상품리스트 불러오기
  useEffect(()=>{
    dispatch(productActions.getProductList({name}));
  },[query]);

  if (loading || !productList)
  return (
    <LoadingSpinner />
  );


  return (
    <Container>
      <Row>
        {productList.length > 0 ? (
          productList.map((item) => (
          <Col key={item._id} md={3} sm={12}>
            <ProductCard item={item}/>
          </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {name === "" ? (
              <h2>등록된 상품이 없습니다!</h2>
            ) : (
              <h2>{name}과 일치한 상품이 없습니다!</h2>
            )}
          </div>
        )}
      </Row>
    </Container>
  );
};

export default ProductAll;

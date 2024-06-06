import React from "react";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../utils/number";
import { Row, Col, Container } from "react-bootstrap";

const ProductCard = ({item}) => {
  const navigate = useNavigate();
  const showProduct = (id) => {
    // 상품 디테일 페이지로 가기
  };
  return (
    <div className="card" onClick={() => showProduct("hard_code")}>
      <img
        src={item?.image}
        alt="product-image"
      />
      <div>{item?.name}</div>
      <div>₩ {currencyFormat(item?.price)}</div>
      <div>{item.status === "disactive"?"품절": ""}</div>
    </div>
  );
};

export default ProductCard;

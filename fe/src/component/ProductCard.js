import React from "react";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../utils/number";
import { Row, Col, Container } from "react-bootstrap";

const ProductCard = ({item, excludeOutOfStock}) => {
  const navigate = useNavigate();
  const stockValue = item?.stock ? Object.keys(item.stock).map((size) => (
    item.stock[size]
    )) : [];

  const allZero = stockValue?.every((value) => value === 0);

  const showProduct = (id) => {
    // 상품 디테일 페이지로 가기
    navigate(`/product/${id}`)
  };
  return (
      <div className="card" onClick={() => showProduct(item?._id)}>
        <img
          className={item.status === "disactive" || allZero ? "soldout-img" : ""}
          src={item?.image}
          alt="product-image"
        />
        <div>{item?.name}</div>
        <div>₩ {currencyFormat(item?.price)}</div>

        {item.status === "disactive" || allZero ?
          (<div className='soldout-sticker'>품절</div>)
          : ""}
      </div>
    )}  

export default ProductCard;

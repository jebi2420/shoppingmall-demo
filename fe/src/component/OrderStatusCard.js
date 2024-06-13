import React from "react";
import { Row, Col, Badge } from "react-bootstrap";
import { badgeBg } from "../constants/order.constants";
import { currencyFormat } from "../utils/number";
import { formatTimestamp } from '../utils/number';
import { useNavigate } from "react-router-dom";

const OrderStatusCard = ({item}) => {
  const navigate = useNavigate();
  return (
    <div>
      <Row className="status-card" onClick={() => navigate(`/account/purchase/${item._id}`)}>
        <Col xs={2}>
          <img
            src={item.items[0].productId.image}
            alt="orderImage"
            height={96}
          />
        </Col>
        <Col xs={8} className="order-info">
          <div>
            <strong>주문번호: {item.orderNum}</strong>
          </div>

          <div className="text-12">{formatTimestamp(item.updatedAt)}</div>
          { item.items.length > 1 ? (
            <div>{item.items[0].productId.name} 외 {item.items.length - 1}개의 상품</div>
          ): (
            <div>{item.items[0].productId.name}</div>
          )}
          <div>₩ {currencyFormat(item.totalPrice)}</div>
        </Col>
        <Col md={2} className="vertical-middle">
          <div className="text-align-center text-12">주문상태</div>
          <Badge bg={badgeBg[item.status]}>{item.status}</Badge>
        </Col>
      </Row>
    </div>
  );
};

export default OrderStatusCard;

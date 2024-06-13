import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { orderActions } from "../action/orderAction";
import { SortByLatest } from "../utils/number";
import  LoadingSpinner  from "../component/LoadingSpinner";
import { formatTimestamp } from '../utils/number';
import "../style/myOrderDetail.style.css";

const MyOrderDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderList } = useSelector((state) => state.order);
  const { loading } = useSelector((state) => state.order);
  const { selectedOrder } = useSelector((state) => state.order);
  const item = selectedOrder?.data;
  const {id} = useParams();
  const statusComponents = {
    preparing: <div className='order-status preparing'>상품준비중</div>,
    shipping: <div>배송중</div>,
    delivered: <div>배송완료</div>,
    refund: <div>환불처리</div>
  };
  const defaultComponent = "-";
  
  //오더리스트 들고오기
  useEffect(()=>{
    console.log("item", item)
    dispatch(orderActions.getOrderDetail(id));
  },[dispatch]);

  // status rederer
  const renderStatusComponent = (status) => {
    return statusComponents[status] || defaultComponent;
  };

  return (
    <Container>
      <Row>
        <Col>
          <div className="myorder-detail-container">
            <section className="my-order">
              <h3>주문상세내역</h3>
              <ul>
                <li>주문일자 {formatTimestamp(item.createdAt)}</li>
                <li>주문번호 {item.orderNum}</li>
              </ul>
              {renderStatusComponent(item.status)}
            </section>
            
            <section className="my-detail">
              <h3>주문상품정보</h3>
            </section>

            <section className="my-buyer">
              <h3>구매자정보</h3>
            </section>

            <section className='my-payment'>
              <h3>결제정보</h3>
            </section>

            <section className='my-address'>
              <h3>배송지정보</h3>
            </section>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MyOrderDetail;

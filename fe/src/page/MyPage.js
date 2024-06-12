import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { orderActions } from "../action/orderAction";
import { SortByLatest } from "../utils/number";
import  LoadingSpinner  from "../component/LoadingSpinner";
import OrderStatusCard from "../component/OrderStatusCard";
import "../style/orderStatus.style.css";

const MyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderList } = useSelector((state) => state.order);
  const { loading } = useSelector((state) => state.order);
  const latestOrderList = SortByLatest(orderList);
  
  //오더리스트 들고오기
  useEffect(()=>{
    dispatch(orderActions.getOrder());
  },[dispatch]);


  return (
    <Container className="status-card-container">
      {latestOrderList.length === 0 || !latestOrderList ? (
          <Col xs={12} md={7}>
            <div className="text-align-center empty-bag">
              <h2>주문한 상품이 없습니다</h2>
              <Button
                variant="dark"
                className="payment-button"
                onClick={() => navigate("/")}
              >
                쇼핑 계속하기
              </Button>
            </div>
          </Col>
      ):(
        latestOrderList.map((item)=>(
          <OrderStatusCard key={item._id} item={item}/>  
        ))
      )}
    </Container>
  );
};

export default MyPage;

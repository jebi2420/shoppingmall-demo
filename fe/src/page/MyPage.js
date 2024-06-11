import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { orderActions } from "../action/orderAction";
import OrderStatusCard from "../component/OrderStatusCard";
import "../style/orderStatus.style.css";

const MyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderList } = useSelector((state) => state.order);
  // const Listlength = orderList.o?rderList.length()

  //오더리스트 들고오기
  useEffect(()=>{
    dispatch(orderActions.getOrderList());
    console.log("order", orderList, "길이",orderList.orderList.length)
  },[dispatch]);

  return (
    <Container className="status-card-container">
      { orderList.orderList.length > 0 ?
        (
          orderList.map((item)=>(
            <OrderStatusCard key={item._id} item={item}/>  
          ))
        
        ):(
          <>
          <h1>주문한 상품이 없습니다</h1>
          <Button
            variant="dark"
            className="payment-button"
            onClick={() => navigate("/")}
          >
            쇼핑 계속하기
          </Button>
          </>
        )
      }
    </Container>
  );
};

export default MyPage;

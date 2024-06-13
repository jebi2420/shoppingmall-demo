import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { orderActions } from "../action/orderAction";
import { SortByLatest } from "../utils/number";
import  LoadingSpinner  from "../component/LoadingSpinner";
import { formatTimestamp } from '../utils/number';
import { currencyFormat } from "../utils/number";
import "../style/myOrderDetail.style.css";

const MyOrderDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderList } = useSelector((state) => state.order);
  const { loading } = useSelector((state) => state.order);
  const { selectedOrder } = useSelector((state) => state.order);
  const orderItem = selectedOrder?.data;
  const {id} = useParams();
  
  //오더리스트 들고오기
  useEffect(()=>{
    console.log("item", orderItem)
    dispatch(orderActions.getOrderDetail(id));
  },[dispatch, id]);

  if (loading || !selectedOrder)
  return (
    <LoadingSpinner />
  );

  return (
    <Container>
      <Row>
        <Col>
          {orderItem.items.length > 0 ? (
            <div className="myorder-detail-container">
              <section className="my-order">
                <h3>주문상세내역</h3>
                <ul className='order-info'>
                  <li>주문일자 <strong>{formatTimestamp(orderItem.createdAt)}</strong></li>
                  <li>주문번호 <strong>{orderItem.orderNum}</strong></li>
                </ul>
                <ul className='status-group'>
                  {orderItem.status === "refund" ? (
                    <>
                      <li className='status-refund'>
                        <span>환불처리</span>
                      </li>
                    </>
                  ):(
                    <>
                      <li className={orderItem.status === "preparing" ? "current-status" : ""}>
                        <span>상품준비중</span>
                      </li>
                        <span>&gt;</span>
                      <li className={orderItem.status === "shipping" ? "current-status" : ""}>
                        <span>배송중</span>
                      </li>
                        <span>&gt;</span>
                      <li className={orderItem.status === "delivered" ? "current-status" : ""}>
                        <span>배송완료</span>
                      </li>     
                    </>              
                  )}
                </ul>

              </section>
              
              <section className="my-product">
                <h3>주문상품정보</h3>
                <ul className='my-prodcut-item-list'>   
                  <li className='my-product-itme-header'>
                    <div>상품정보</div>
                    <div>가격</div>
                    <div>수량</div>
                  </li>            
                  {orderItem.items?.map((item)=>(
                      <li className='my-product-item' key={item._id} onClick={() => navigate(`/product/${item.productId._id}`)}>
                        <div>
                          <div className='product-info-left'>
                            <img
                              src={item.productId.image}
                              alt="orderImage"
                              height={96}
                            />
                            <span className='product-name'>{item.productId.name}</span>
                            <span> / 사이즈: {item.size.toUpperCase()}</span>
                          </div>
                        </div>
                        <div>₩ {currencyFormat(item.price)}</div>
                        <div>수량 {item.qty} 개</div>
                      </li>
                  ))
                  }
                </ul>
              </section>

              <section className="my-buyer">
                <h3>구매자정보</h3>
                <div>
                  <div>
                    <div>주문자</div>
                    <div>{orderItem.userId.name}</div>
                  </div>
                  <div>
                    <div>이메일</div>
                    <div>{orderItem.userId.email}</div>
                  </div>
                </div>
              </section>

              <section className='my-payment'>
                <h3>결제정보</h3>
                <div>
                  <div>결제금액</div>
                  <h5>₩ {currencyFormat(orderItem.totalPrice)}</h5>
                </div>
              </section>

              <section className='my-address'>
                <h3>배송지정보</h3>
                <div>
                  <div>받는사람</div>
                  <div>{orderItem.contact.lastName}{orderItem.contact.firstName}</div>
                </div>
                <div>
                  <div>전화번호</div>
                  <div>{orderItem.contact.contact}</div>
                </div>
                <div>
                  <div>주소</div>
                  <div>{orderItem.shipTo.address}</div>
                </div>
              </section>
            </div>
          ):("")}
        </Col>
      </Row>
    </Container>
  );
};

export default MyOrderDetail;

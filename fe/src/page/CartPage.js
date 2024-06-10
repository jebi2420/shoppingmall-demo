import React from "react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../action/cartAction";
import { commonUiActions } from "../action/commonUiAction";
import  LoadingSpinner  from "../component/LoadingSpinner";
import CartProductCard from "../component/CartProductCard";
import OrderReceipt from "../component/OrderReceipt";
import "../style/cart.style.css";
import * as types from "../constants/cart.constants";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { cartList, totalPrice } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.cart);

 

  useEffect(() => {
    //카트리스트 불러오기
    dispatch(cartActions.getCartList());
    console.log("cart",cartList)
  }, [dispatch]);

  // if (loading){
  //   return (
  //     <LoadingSpinner />
  //   );
  // }

  if (!user) {
    if (loading) return;
    navigate("/login");
  }

  return (
    <Container>

      <Row>
        { cartList.length > 0 ? (
          <>
            <Col xs={12} md={7}>
              {cartList.map((item, index) => (
                <CartProductCard key={item._id} item={item}/>
              ))}
            </Col>
            <Col xs={12} md={5}>
              <OrderReceipt 
                cartList={cartList} 
                totalPrice={totalPrice} 
              />
            </Col>
          </>
        ):(
          <Col xs={12} md={7}>
            <div className="text-align-center empty-bag">
              <h2>카트가 비어있습니다.</h2>
              <div>상품을 담아주세요!</div>
              <Button
                variant="dark"
                className="payment-button"
                onClick={() => navigate("/")}
              >
                쇼핑 계속하기
              </Button>
            </div>
          </Col>
        )}

      </Row>
    </Container>
  );
};

export default CartPage;

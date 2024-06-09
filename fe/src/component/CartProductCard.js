import React, { useEffect, useState  } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../action/cartAction";
import { currencyFormat } from "../utils/number";
import { commonUiActions } from '../action/commonUiAction';

const CartProductCard = ({ item }) => {
  const dispatch = useDispatch();
  let availableStock = 0;

  useEffect(() => {
    // 재고의 양이 변한다. -> 재고의 양과 카트의 qty를 비교한다. 
    // qty가 재고의 양보다 많다면 qty를 재고 수량으로 변경
    Object.keys(item.productId.stock).map((stockSize)=> {
      if(stockSize === item.size){
        availableStock = item.productId.stock[stockSize];
        if(availableStock < item.qty){
          dispatch(cartActions.updateQty(item.productId._id, item.size, availableStock));
        }
      }
    });
  }, [item.productId.stock]);

  //아이템 수량을 수정한다
  const handleQtyChange = (id, size, value) => {
    dispatch(cartActions.updateQty(id, size, value));
  };

  const deleteCart = (id, size) => {
    //아이템을 지운다
    dispatch(cartActions.deleteCartItem(id, size));
  };

  return (
    <div 
      className="product-card-cart"
    >
      <Row>
        <Col md={2} xs={12}>
          <img
            src={item.productId.image}
            width={112}
          />
        </Col>
        <Col md={10} xs={12}>
          <div className="display-flex space-between">
            <h4>{item.productId.name}</h4>
            <button className="trash-button">
              <FontAwesomeIcon
                icon={faTrash}
                width={24}
                onClick={() => deleteCart(item.productId._id, item.size)}
              />
            </button>
          </div>

          <div>
            <strong>₩ {currencyFormat(item.productId.price)}</strong>
          </div>
          <div>Size: {item.size.toUpperCase()}</div>
          <div>Total: ₩ {currencyFormat(item.productId.price * item.qty)}</div>
          <div>{Object.keys(item.productId.stock).map((size, index)=> {
            if(size === item.size && item.productId.stock[size] <= 5 && item.productId.stock[size] > 0){
              return(
                <div className='stock'>재고: {item.productId.stock[size]}</div>
              );
            }
            return null
          }
          )} 
          
          </div>
          <div>
            Quantity:
            <Form.Select
              onChange={(event) => handleQtyChange(item.productId._id, item.size, event.target.value)}
              required
              defaultValue={item.qty}
              className="qty-dropdown"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
              <option value={10}>10</option>
            </Form.Select>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;

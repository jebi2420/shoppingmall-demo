import * as types from "../constants/cart.constants";
import {
  LOGIN_SUCCESS,
  GOOGLE_LOGIN_SUCCESS,
  LOGOUT,
} from "../constants/user.constants";

const initialState = {
  loading: false,
  error:"",
  cartItemQty: 0,
  cartList: [],
  totalPrice: 0
};

function cartReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type){
    case types.ADD_TO_CART_REQUEST:
    case types.GET_CART_LIST_REQUEST:
    case types.GET_CART_QTY_REQUEST:
    case types.DELETE_CART_ITEM_REQUEST:
      return{...state, loading: true}
    case types.ADD_TO_CART_SUCCESS:
    case types.GET_CART_QTY_SUCCESS:
    case types.DELETE_CART_ITEM_SUCCESS:
      return{...state, loading: false, error: "", cartItemQty: payload} 
    case types.GET_CART_LIST_SUCCESS:
      return{...state, loading: false, error: "", cartList: payload,
              totalPrice: payload.reduce((total, item)=> (total += item.productId.price * item.qty),0)}
    case types.ADD_TO_CART_FAIL:
    case types.GET_CART_LIST_FAIL:
    case types.GET_CART_QTY_FAIL:
    case types.DELETE_CART_ITEM_FAIL:
      return{...state, loading: false, error: payload}
    case types.CLEAR_CART:
      return{...state, loading: false, error: "", cartItemQty: 0, cartList: [], totalPrice: 0}
    default:
      return state;
  }
}
export default cartReducer;

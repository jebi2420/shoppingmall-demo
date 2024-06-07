import api from "../utils/api";
import * as types from "../constants/cart.constants";
import { commonUiActions } from "../action/commonUiAction";

const addToCart =
  ({ id, size }) =>
  async (dispatch) => {
    try{
      dispatch({type: types.ADD_TO_CART_REQUEST});
      const response = await api.post("/cart", {productId: id, size, pty: 1}); 
      console.log("rrr", response)
      if(response.status !== 200) throw new Error (response.error);
      dispatch({
        type:types.ADD_TO_CART_SUCCESS, 
        payload: response.data.cartItemQty,
      }) 
      dispatch(commonUiActions.showToastMessage("카트에 상품이 추가됐습니다", "success"));
    }catch(error){
      dispatch({type: types.ADD_TO_CART_FAIL, payload: error.error});
      dispatch(commonUiActions.showToastMessage(error.error, "error"));
    }
  };

const getCartList = () => async (dispatch) => {};
const deleteCartItem = (id) => async (dispatch) => {};

const updateQty = (id, value) => async (dispatch) => {};
const getCartQty = () => async (dispatch) => {};
export const cartActions = {
  addToCart,
  getCartList,
  deleteCartItem,
  updateQty,
  getCartQty,
};

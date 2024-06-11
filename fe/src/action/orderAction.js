import api from "../utils/api";
import * as types from "../constants/order.constants";
import { cartActions } from "./cartAction";
import { commonUiActions } from "./commonUiAction";

const createOrder = (payload, navigate) => async (dispatch) => {
  try{
    dispatch({type: types.CREATE_ORDER_REQUEST});
    const response = await api.post("/order", payload);
    if(response.status !== 200) throw new Error(response.error);
    dispatch({type: types.CREATE_ORDER_SUCCESS, payload: response.data.orderNum});
    // order 생성 후(cart 초기화 후), 쇼핑백 개수 업데이트
    dispatch(cartActions.getCartQty());
    navigate("/payment/success")
  }catch(error){
    dispatch({type: types.CREATE_ORDER_FAIL, payload: error.error});
    dispatch(commonUiActions.showToastMessage(error.error, "error"));
  }
};

const getOrder = () => async (dispatch) => {};

const getOrderList = () => async (dispatch) => {
  try{
    dispatch({type: types.GET_ORDER_LIST_REQUEST});
    const response = await api.get("/order");
    if(response.status !== 200) throw new Error(response.error);
    dispatch({type: types.GET_ORDER_LIST_SUCCESS, payload: response.data.orderList});

  }catch(error){
    dispatch({type: types.GET_ORDER_LIST_FAIL, payload: error.error});
    dispatch(commonUiActions.showToastMessage(error.error, "error"));
  }
};

const updateOrder = (id, status) => async (dispatch) => {};

export const orderActions = {
  createOrder,
  getOrder,
  getOrderList,
  updateOrder,
};

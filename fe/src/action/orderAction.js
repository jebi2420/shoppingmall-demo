import api from "../utils/api";
import * as types from "../constants/order.constants";
import { cartActions } from "./cartAction";
import { commonUiActions } from "./commonUiAction";
import { SortedOrderList } from '../utils/number';

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

// 나의 order 리스트 가져오기
const getOrder = () => async (dispatch) => {
  try{
    dispatch({type: types.GET_ORDER_REQUEST});
    const response = await api.get("/order/me");
    if(response.status !== 200) throw new Error(response.error);
    dispatch({type: types.GET_ORDER_SUCCESS, payload: response.data});
  }catch(error){
    dispatch({ type: types.GET_ORDER_FAIL, error: error });
    dispatch(commonUiActions.showToastMessage(error, "error"));
  }
};

// 나의 주문 상세보기
const getOrderDetail = (id) => async (dispatch) => {
  try{
    dispatch({type: types.GET_ORDER_DETAIL_REQUEST});
    const response = await api.get(`/order/me/${id}`);
    console.log("rrr",response.data)
    if(response.status !== 200) throw new Error(response.error);
    dispatch({type: types.GET_ORDER_DETAIL_SUCCESS, payload: response.data});
  }catch(error){
    dispatch({ type: types.GET_ORDER_DETAIL_FAIL, error: error });
  }
}

// 모든 order 리스트 가져오기 (admin 용)
const getOrderList = (query) => async (dispatch) => {
  try{
    dispatch({type: types.GET_ORDER_LIST_REQUEST});
    const response = await api.get("/order", { params: {...query}});
    if(response.status !== 200) throw new Error(response.error);
    dispatch({type: types.GET_ORDER_LIST_SUCCESS, payload: response.data});

  }catch(error){
    dispatch({type: types.GET_ORDER_LIST_FAIL, payload: error.error});
    dispatch(commonUiActions.showToastMessage(error.error, "error"));
  }
};

const updateOrder = (id, status, setSearchQuery) => async (dispatch) => {
  try{
    dispatch({type: types.UPDATE_ORDER_REQUEST});
    const response = await api.put(`/order/${id}`, {status});
    if(response.status !== 200) throw new Error(response.error);
    dispatch({type: types.UPDATE_ORDER_SUCCESS});
    dispatch(commonUiActions.showToastMessage("주문 수정 완료", "success"));
     // 수정 반영 위해 다시 productList 전체 갖고 오기
     dispatch(getOrderList({page:1, name:""}));
     setSearchQuery({page:1, name:""})
  }catch(error){
    dispatch({type: types.UPDATE_ORDER_FAIL, payload: error.error});
    dispatch(commonUiActions.showToastMessage(error.error, "error"));
  }
};


export const orderActions = {
  createOrder,
  getOrder,
  getOrderDetail,
  getOrderList,
  updateOrder,
};

import * as types from "../constants/order.constants";

const initialState = {
  loading: false,
  error: "",
  orderNum: "",
  orderList: [],
  totalPageNum: 1,
  selectedOrder: null,
};

function orderReducer(state = initialState, action) {
  const { type, payload } = action;
  switch(type){
    case types.CREATE_ORDER_REQUEST:
    case types.GET_ORDER_REQUEST:
    case types.GET_ORDER_LIST_REQUEST:
    case types.UPDATE_ORDER_REQUEST:
    case types.GET_ORDER_DETAIL_REQUEST:
      return{ ...state, loading: true };
    case types.CREATE_ORDER_SUCCESS:
      return{...state, loading: false, error: "", orderNum: payload};
    case types.GET_ORDER_LIST_SUCCESS:
    case types.GET_ORDER_SUCCESS:
      return{...state, loading: false, error: "", 
              orderList: payload.data,
              totalPageNum: payload.totalPageNum
            };
    case types.GET_ORDER_DETAIL_SUCCESS:
      return{...state, loading: false, error: "", selectedOrder: payload };
    case types.UPDATE_ORDER_SUCCESS:
      return{...state, loading: false, error: ""};
    case types.CREATE_ORDER_FAIL:
    case types.GET_ORDER_LIST_FAIL:
    case types.GET_ORDER_FAIL:
    case types.UPDATE_ORDER_FAIL:
    case types.GET_ORDER_DETAIL_FAIL:
      return{ ...state, loading: false, error: payload };
    case types.SET_SELECTED_ORDER:
      return{...state, selectedOrder: payload}        
    default:
      return state;
  }
}
export default orderReducer;

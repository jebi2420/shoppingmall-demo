import api from "../utils/api";
import * as types from "../constants/product.constants";
import { toast } from "react-toastify";
import { commonUiActions } from "./commonUiAction";

const getProductList = (query) => async (dispatch) => {
  try{
    dispatch({type: types.PRODUCT_GET_REQUEST});
    const response = await api.get("/product", {
      params: {...query} //검색조건 함께 보내기
    });
    console.log("response", response)
    if(response.status !== 200) throw new Error(response.error);
    dispatch({type: types.PRODUCT_GET_SUCCESS, payload: response.data.data});
  }catch(error){
    dispatch({type: types.PRODUCT_GET_FAIL, payload: error.error});
    dispatch(commonUiActions.showToastMessage(error.error, "error"));
  }
};
const getProductDetail = (id) => async (dispatch) => {};

const createProduct = (formData) => async (dispatch) => {
  try{
    dispatch({type: types.PRODUCT_CREATE_REQUEST});
    const response = await api.post("/product", formData);
    if(response.status !== 200) throw new Error (response.error);
    dispatch({type: types.PRODUCT_CREATE_SUCCESS});
    // ToastMessage로 생성완료 메시지 보여주기
    dispatch(commonUiActions.showToastMessage("상품 생성 완료", "success"));
  }catch(error){
    dispatch({type: types.PRODUCT_CREATE_FAIL, payload: error.error});
    // ToastMessage로도 에러를 보여주자
    dispatch(commonUiActions.showToastMessage(error.error, "error"));
  }
};
const deleteProduct = (id) => async (dispatch) => {};

const editProduct = (formData, id) => async (dispatch) => {};

export const productActions = {
  getProductList,
  createProduct,
  deleteProduct,
  editProduct,
  getProductDetail,
};

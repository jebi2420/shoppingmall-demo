import api from "../utils/api";
import * as types from "../constants/product.constants";
import { toast } from "react-toastify";
import { commonUiActions } from "./commonUiAction";

// 상품 리스트 가져오기
const getProductList = (query) => async (dispatch) => {
  try{
    dispatch({type: types.PRODUCT_GET_REQUEST});
    const response = await api.get("/product", {
      params: {...query} //검색조건 함께 보내기
    });
    if(response.status !== 200) throw new Error(response.error);
    dispatch({type: types.PRODUCT_GET_SUCCESS, payload: response.data});
  }catch(error){
    dispatch({type: types.PRODUCT_GET_FAIL, payload: error.error});
    dispatch(commonUiActions.showToastMessage(error.error, "error"));
  }
};

// 상품 디테일 가져오기
const getProductDetail = (id) => async (dispatch) => {};

// 상품 생성
const createProduct = (formData, setShowDialog) => async (dispatch) => {
  try{
    dispatch({type: types.PRODUCT_CREATE_REQUEST});
    const response = await api.post("/product", formData);
    if(response.status !== 200) throw new Error (response.error);
    dispatch({type: types.PRODUCT_CREATE_SUCCESS});
    // ToastMessage로 생성완료 메시지 보여주기
    dispatch(commonUiActions.showToastMessage("상품 생성 완료", "success"));
    setShowDialog(false);
    // 생성 반영 위해 다시 productList 전체 갖고 오기
    dispatch(getProductList({page:1, name:""}));
  }catch(error){
    dispatch({type: types.PRODUCT_CREATE_FAIL, payload: error.error});
    // ToastMessage로도 에러를 보여주자
    dispatch(commonUiActions.showToastMessage(error.error, "error"));
  }
};

// 상품 삭제
const deleteProduct = (id) => async (dispatch) => {
  try{
    dispatch({type: types.PRODUCT_DELETE_REQUEST});
    const response = await api.put(`/product/delete/${id}`);
    if(response.status !== 200) throw new Error (response.error);
    dispatch({type: types.PRODUCT_DELETE_SUCCESS});
    dispatch(commonUiActions.showToastMessage("상품 삭제 완료", "success"));
    // 삭제 반영 위해 다시 productList 전체 갖고 오기
    dispatch(getProductList({page:1, name:""}));
  }catch(error){
    dispatch({type: types.PRODUCT_DELETE_FAIL, payload: error.error});
    dispatch(commonUiActions.showToastMessage(error.error, "error"));
  }
};

// 상품 수정
const editProduct = (formData, id, setShowDialog) => async (dispatch) => {
  try{
    dispatch({type: types.PRODUCT_EDIT_REQUEST});
    const response = await api.put(`/product/${id}`, formData);
    if(response.status !== 200) throw new Error (response.error);
    dispatch({type: types.PRODUCT_EDIT_SUCCESS});
    dispatch(commonUiActions.showToastMessage("상품 수정 완료", "success"));
    setShowDialog(false);
    // 수정 반영 위해 다시 productList 전체 갖고 오기
    dispatch(getProductList({page:1, name:""}));
  }catch(error){
    dispatch({type: types.PRODUCT_EDIT_FAIL, payload: error.error});
    dispatch(commonUiActions.showToastMessage(error.error, "error"));
  }
};

export const productActions = {
  getProductList,
  createProduct,
  deleteProduct,
  editProduct,
  getProductDetail,
};

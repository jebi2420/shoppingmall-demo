import api from "../utils/api";
import * as types from "../constants/user.constants";
import { commonUiActions } from "./commonUiAction";
import * as commonTypes from "../constants/commonUI.constants";
import { useNavigate } from 'react-router';
const loginWithToken = () => async (dispatch) => {};
const loginWithEmail = ({email, password}) => async (dispatch) => {
  try{
    dispatch({type: types.LOGIN_REQUEST});
    const response = await api.post("/auth/login", {email, password});
    if(response.status !== 200) throw new Error(response.error);
    sessionStorage.setItem("token", response.data.token);
    dispatch({type: types.LOGIN_SUCCESS, payload:response.data});
  }catch(error){
    dispatch({type:types.LOGIN_FAIL, payload:error.error});
  }
};
const logout = () => async (dispatch) => {};

const loginWithGoogle = (token) => async (dispatch) => {};

const registerUser =
  ({ email, name, password }, navigate) =>
  async (dispatch) => {
    try{
      dispatch({type: types.REGISTER_USER_REQUEST});
      const response = await api.post("/user", {email, name, password});
      if(response.status !== 200){throw new Error(response.error);}
      dispatch({ type:types.REGISTER_USER_SUCCESS })
      dispatch(commonUiActions.showToastMessage("회원가입을 완료 했습니다!", "success"));
      navigate("/login");
    }catch(error){
      dispatch({ type:types.REGISTER_USER_FAIL, payload:error.error })
    }
  };
export const userActions = {
  loginWithToken,
  loginWithEmail,
  logout,
  loginWithGoogle,
  registerUser,
};

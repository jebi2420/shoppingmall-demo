import api from "../utils/api";
import * as types from "../constants/user.constants";
import { commonUiActions } from "./commonUiAction";
import * as commonTypes from "../constants/commonUI.constants";
import { useNavigate } from 'react-router';
// 토큰으로 로그인
const loginWithToken = () => async (dispatch) => {
  try{
    dispatch({type: types.LOGIN_WITH_TOKEN_REQUEST});
    const response = await api.get("/user/me");
    if(response.status !== 200) throw new Error(response.error);
    console.log("response:", response);
    dispatch({type: types.LOGIN_WITH_TOKEN_SUCCESS, payload: response.data});
  }catch(error){
    dispatch({type: types.LOGIN_WITH_TOKEN_FAIL, payload:error.error});
    // invalid 토큰이면 지워주기
    dispatch(logout());
  }
};

// 이메일로 로그인
const loginWithEmail = ({email, password}) => async (dispatch) => {
  try{
    dispatch({type: types.LOGIN_REQUEST});
    const response = await api.post("/auth/login", {email, password});
    if(response.status !== 200) throw new Error(response.error);
    sessionStorage.setItem("token", response.data.token);
    dispatch({type: types.LOGIN_SUCCESS, payload:response.data});
    const name = response.data.user.name;
    dispatch(commonUiActions.showToastMessage(`${name}님 환영합니다!`, "success"));
  }catch(error){
    dispatch({type: types.LOGIN_FAIL, payload:error.error});
  }
};

// 로그아웃
const logout = () => async (dispatch) => {
  // user 정보를 지우고
  dispatch({type: types.LOGOUT});
  // session token의 값을 지운다
  sessionStorage.removeItem("token");
  dispatch(commonUiActions.showToastMessage("로그아웃 되었습니다","info"));
};

const loginWithGoogle = (token) => async (dispatch) => {};

// 회원가입
const registerUser =
  ({ email, name, password }, navigate) =>
  async (dispatch) => {
    try{
      dispatch({type: types.REGISTER_USER_REQUEST});
      const response = await api.post("/user", {email, name, password});
      if(response.status !== 200){throw new Error(response.error);}
      dispatch({ type:types.REGISTER_USER_SUCCESS })
      dispatch(commonUiActions.showToastMessage("회원가입을 완료했습니다!", "success"));
      navigate("/login");
    }catch(error){
      dispatch({ type:types.REGISTER_USER_FAIL, payload:error.error })
    }
  };

// 에러 메시지 초기화
const clearError = () => (dispatch) => {
  dispatch({ type:types.REGISTER_USER_ERROR_CLEAR })
}
export const userActions = {
  loginWithToken,
  loginWithEmail,
  logout,
  loginWithGoogle,
  registerUser,
  clearError
};

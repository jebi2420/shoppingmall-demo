import * as types from "../constants/commonUI.constants";
const initialState = {
  toastMessage: { message: "", status: "" },
  modalMessage:""
};

function commonUiReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.SET_TOAST_MESSAGE:
      return {
        ...state,
        toastMessage: {
          ...state.toastMessage,
          message: payload.message,
          status: payload.status,
        },
      };
    case types.SET_ALERT_MODAL:
      return {
        ...state,
        modalMessage: payload
      }
    default:
      return state;
  }
}
export default commonUiReducer;

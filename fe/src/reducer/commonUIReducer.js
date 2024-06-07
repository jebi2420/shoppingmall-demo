import * as types from "../constants/commonUI.constants";
const initialState = {
  toastMessage: { message: "", status: "" },
  linkModal: { message: "", link:""}
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
    case types.SET_LINK_MODAL:
      return {
        linkModal: {
          ...state,
          message: payload.message,
          link: payload.link
        }        
      }
    default:
      return state;
  }
}
export default commonUiReducer;

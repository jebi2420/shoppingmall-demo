import * as types from "../constants/commonUI.constants";

const showToastMessage = (message, status) => async (dispatch) => {
  dispatch({ type: types.SET_TOAST_MESSAGE, payload: { message, status } });
};

const showLinkModal = (message, link) => async (dispatch) => {
  dispatch({ type: types.SET_LINK_MODAL, payload: { message, link }});
}

export const commonUiActions = {
  showToastMessage,
  showLinkModal
};
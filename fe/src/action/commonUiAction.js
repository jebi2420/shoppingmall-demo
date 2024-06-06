import * as types from "../constants/commonUI.constants";

const showToastMessage = (message, status) => async (dispatch) => {
  dispatch({ type: types.SET_TOAST_MESSAGE, payload: { message, status } });
};

const showAlertModal = (message) => async (dispatch) => {
  dispatch({ type: types.SET_ALERT_MODAL, payload: { message }});
}

export const commonUiActions = {
  showToastMessage,
  showAlertModal
};
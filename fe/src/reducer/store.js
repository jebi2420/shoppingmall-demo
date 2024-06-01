import { configureStore } from "@reduxjs/toolkit";
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import userReducer from "./userReducer";
import productReducer from "./productReducer";
import cartReducer from "./cartReducer";
import commonUiReducer from "./commonUIReducer";
import orderReducer from "./orderReducer";
import { composeWithDevTools } from '@redux-devtools/extension';

// rootReducer를 combineReducers를 사용하여 합침
const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  cart: cartReducer,
  ui: commonUiReducer,
  order: orderReducer,
});

// Redux DevTools를 사용하여 store를 생성
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;

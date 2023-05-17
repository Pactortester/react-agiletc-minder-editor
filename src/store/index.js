import { createStore, applyMiddleware, compose } from "redux";
//引入Reducer
import Reducer from "./reducer/index";
//引入中间件
import thunkMiddleware from "redux-thunk";

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
const configureStore = (initialState) => {
  const store = createStoreWithMiddleware(Reducer, initialState);
  return store;
};
export default configureStore();

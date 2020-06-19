import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import CategoryReducer from './CategoryReducer';
import SystemReducer from './SystemReducer';

const AppReducers = combineReducers({
  AuthReducer,
  CategoryReducer,
  SystemReducer,
});

const RoorReducer = (state, action) => {
  return AppReducers(state, action);
};
export default RoorReducer;

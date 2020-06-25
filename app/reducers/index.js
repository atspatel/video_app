import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import CategoryReducer from './CategoryReducer';
import SystemReducer from './SystemReducer';
import CreateVideoReducer from './CreateVideoReducer';
import FollowMappingReducer from './FollowMappingReducer';

const AppReducers = combineReducers({
  AuthReducer,
  CategoryReducer,
  SystemReducer,
  CreateVideoReducer,
  FollowMappingReducer,
});

const RootReducer = (state, action) => {
  return AppReducers(state, action);
};
export default RootReducer;

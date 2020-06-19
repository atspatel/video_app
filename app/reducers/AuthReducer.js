import * as Actions from '../functions/ActionTypes';

const initial_state = {
  PhoneNumber: null,
  user_id: null,
  Token: null,
  user_name: null,
  AnnonymousToken: null,
  LogInError: false,

  message: null,
};

function AuthReducer(state = initial_state, action) {
  switch (action.type) {
    case Actions.SET_ANNONYMOUS_TOKEN: {
      if (action.status) {
        return {
          ...state,
          AnnonymousToken: action.ann_token,
        };
      } else {
        return state;
      }
    }
    case Actions.CALL_LOG_IN:
      if (action.status) {
        // return initial_state
        return {
          ...state,
          Token: action.token,
          PhoneNumber: action.phone_number,
          user_id: action.user_id,
          user_name: action.user_name,
          LogInError: false,
          AnnonymousToken: action.ann_token,
          message: null,
        };
      } else {
        return {
          ...state,
          Token: null,
          LogInError: true,
          user_id: null,
          user_name: null,
          message: null,
        };
      }
    case Actions.SET_USERNAME:
      return {
        ...state,
        user_name: action.user_name,
      };
    case Actions.CALL_LOG_OUT:
      return {
        ...state,
        AnnonymousToken: action.ann_token,
        Token: null,
        user_id: null,
        user_name: null,
      };
    default:
      return state;
  }
}

export default AuthReducer;

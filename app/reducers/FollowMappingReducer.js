import * as Actions from '../functions/ActionTypes';

const initial_state = {
  user_follow_mapping: {},
};

function FollowMappingReducer(state = initial_state, action) {
  switch (action.type) {
    case Actions.UPDATE_FOLLOW_MAPPING: {
      const {qid, is_followed} = action;
      const follow_mapping = {...state.user_follow_mapping, [qid]: is_followed};
      return {
        ...state,
        user_follow_mapping: follow_mapping,
      };
    }
    case Actions.CLEAR_FOLLOW_MAPPING: {
      return {
        ...state,
        user_follow_mapping: {},
      };
    }
    default:
      return state;
  }
}

export default FollowMappingReducer;

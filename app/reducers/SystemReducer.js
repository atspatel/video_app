import * as Actions from '../functions/ActionTypes';
const initial_state = {
  volume: 0,
};
function SystemReducer(state = initial_state, action) {
  switch (action.type) {
    case Actions.SET_VOLUME: {
      return {
        ...state,
        volume: action.volume,
      };
    }
    default:
      return state;
  }
}

export default SystemReducer;

import * as Actions from './ActionTypes';
export const setVolume = volume => dispatch => {
  dispatch({
    type: Actions.SET_VOLUME,
    volume: volume,
  });
};

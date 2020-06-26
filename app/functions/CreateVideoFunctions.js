import * as Actions from './ActionTypes';
import moment from 'moment';

export const setVideoList = video_list => dispatch => {
  dispatch({
    type: Actions.SET_VIDEO_LIST,
    video_list: video_list,
  });
};

export const clearVideoList = video_list => dispatch => {
  dispatch({
    type: Actions.CLEAR_VIDEO_LIST,
  });
};

// export const clearCache = video_list => dispatch => {
//   (current = moment().utcOffset('+05:30')), video_list.map(item => {});
// };

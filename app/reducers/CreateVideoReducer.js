import * as Actions from '../functions/ActionTypes';

const initial_state = {
  video_list: [],
};

function CreateVideoReducer(state = initial_state, action) {
  switch (action.type) {
    case Actions.SET_VIDEO_LIST: {
      return {
        ...state,
        video_list: action.video_list,
      };
    }
    case Actions.CLEAR_VIDEO_LIST: {
      return {
        ...state,
        video_list: [],
      };
    }
    case Actions.DELETE_VIDEO_DATA: {
      const id = action.video_data.id;
      const video_list = state.video_list.filter(item => item.id != id);
      return {
        ...state,
        video_list: video_list,
      };
    }
    default:
      return state;
  }
}

export default CreateVideoReducer;

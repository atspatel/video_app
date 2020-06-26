import * as Actions from '../functions/ActionTypes';
import RNFetchBlob from 'react-native-fetch-blob';

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
      state.video_list.map(item => {
        if (item.method === 'captured') {
          RNFetchBlob.fs.unlink(item.filePath);
          RNFetchBlob.fs.unlink(item.uri.replace('file://', ''));
          RNFetchBlob.fs.unlink(item.thumbnail_path);
        }
      });
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
    case Actions.ADD_VIDEO_DATA: {
      const id = action.video_data.id;
      if (state.video_list.some(item => item.id === id)) {
        return state;
      } else {
        const video_list = [...state.video_list, action.video_data];
        return {
          ...state,
          video_list: video_list,
        };
      }
    }
    default:
      return state;
  }
}

export default CreateVideoReducer;

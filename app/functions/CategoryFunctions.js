import * as Actions from './ActionTypes';
import * as myConfig from '../../config';
import axios from 'axios';

const host = myConfig.host;

export const getCategories = () => dispatch => {
  const url = `${host}/keypoints/category/`;
  axios
    .get(url)
    .then(response => {
      dispatch({
        type: Actions.SET_CATEGORY_OPTIONS,
        status: response.data.status,
        category_options: response.data.category_options,
      });
    })
    .catch(error => console.error(error));
};

export const setCategory = category => dispatch => {
  dispatch({
    type: Actions.SET_CATEGORY,
    category: category,
  });
};

export async function get_topic_data(qcat, qid, searchText) {
  let output = null;
  let api_url = `${host}/keypoints/topic/`;
  if (searchText) {
    api_url = `${api_url}${searchText}/`;
  } else if (qcat && qid) {
    api_url = `${api_url}?qcat=${qcat}&qid=${qid}`;
  }
  await axios.get(api_url).then(response => {
    output = response.data;
  });
  return output;
}

export async function get_options(isTopic) {
  let output = null;
  let api_url = `${host}/keypoints/get_options/`;
  if (isTopic) {
    api_url = `${api_url}?isTopic=${isTopic}`;
  }
  await axios.get(api_url).then(response => {
    output = response.data;
  });
  return output;
}

export async function get_preferences() {
  let output = null;
  let api_url = `${host}/keypoints_account/preferences/`;
  await axios.get(api_url).then(response => {
    output = response.data;
  });
  return output;
}

export async function post_preferences(languages, categories) {
  let output = null;
  const data = {
    languages: JSON.stringify(languages),
    categories: JSON.stringify(categories),
  };
  let api_url = `${host}/keypoints_account/preferences/`;
  await axios.post(api_url, data).then(response => {
    output = response.data;
  });
  return output;
}

export async function get_hashtag_follow(hahstag_id) {
  let output = null;
  let api_url = `${host}/keypoints/hashtag_follow/${hahstag_id}/`;
  await axios.get(api_url).then(response => {
    output = response.data;
  });
  return output;
}

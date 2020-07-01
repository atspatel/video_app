import * as Actions from '../functions/ActionTypes';
import * as myConfig from '../../config';
import axios from 'axios';

const host = myConfig.host;

export async function post_follow(category, action, qid) {
  var output = null;
  let api_url = `${host}/keypoints_account/follow/`;
  const data = {category: category, action: action, qid: qid};
  await axios
    .post(api_url, data)
    .then(response => {
      output = response.data;
    })
    .catch(error => console.error(error));
  return output;
}

export async function get_follow(category, id) {
  var output = null;
  let api_url = `${host}/keypoints_account/follow/?category=${category}&qid=${id}`;
  await axios
    .get(api_url)
    .then(response => {
      output = response.data;
    })
    .catch(error => console.error(error));
  return output;
}

export async function get_creator_data(seacrhText, short) {
  var output = null;
  let api_url = `${host}/keypoints_account/creators/`;
  if (seacrhText) {
    api_url = `${api_url}${seacrhText}/`;
  }
  if (short) {
    api_url = `${api_url}?short=1`;
  }
  await axios
    .get(api_url)
    .then(response => {
      output = response.data;
    })
    .catch(error => console.error(error));
  return output;
}

export async function getUserData(user_id) {
  var output = null;
  let api_url = `${host}/keypoints_account/creators/?user_id=${user_id}`;
  await axios
    .get(api_url)
    .then(response => {
      output = response.data;
    })
    .catch(error => console.error(error));
  return output;
}

export async function check_username(username) {
  var output = null;
  let api_url = `${host}/keypoints_account/check_username/${username}/`;
  await axios
    .get(api_url)
    .then(response => {
      output = response.data;
    })
    .catch(error => console.error(error));
  return output;
}

export const updateFollowMapping = (qid, is_followed) => dispatch => {
  dispatch({
    type: Actions.UPDATE_FOLLOW_MAPPING,
    qid: qid,
    is_followed: is_followed,
  });
};

export const clearFollowMapping = () => dispatch => {
  dispatch({
    type: Actions.CLEAR_FOLLOW_MAPPING,
  });
};

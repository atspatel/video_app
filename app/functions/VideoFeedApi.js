import * as myConfig from '../../config';
import axios from 'axios';

const host = myConfig.host;

export async function get_single_video_data(video_id) {
  var output = null;
  let api_url = `${host}/keypoints/video_feed/${video_id}/`;
  await axios
    .get(api_url)
    .then(response => {
      output = response.data;
    })
    .catch(error => console.error(error));
  return output;
}

export async function get_video_data(qcat, qid, next_p) {
  var output = null;
  let api_url = `${host}/keypoints/video_feed/?p=${next_p}`;
  if (qcat != undefined && qid != undefined) {
    api_url = `${api_url}&qcat=${qcat}&qid=${qid}`;
  }

  await axios
    .get(api_url, {
      headers: {'Content-type': 'application/json'},
    })
    .then(response => {
      output = response.data;
    })
    .catch(error => console.error(error));
  return output;
}

export async function post_video_like(video_id, action) {
  var output = null;
  let api_url = `${host}/keypoints/post_like/`;
  const data = {video_id: video_id, action: action};
  await axios
    .post(api_url, data)
    .then(response => {
      output = response.data;
    })
    .catch(error => console.error(error));
  return output;
}

export async function post_video_reshare(video_id) {
  var output = null;
  let api_url = `${host}/keypoints/post_reshare/`;
  const data = {video_id: video_id};
  await axios
    .post(api_url, data)
    .then(response => {
      output = response.data;
    })
    .catch(error => console.error(error));
  return output;
}

export async function delete_video(video_id) {
  var output = null;
  let api_url = `${host}/keypoints/video_feed/${video_id}/`;
  await axios
    .delete(api_url)
    .then(response => {
      output = response.data;
    })
    .catch(error => console.error(error));
  return output;
}

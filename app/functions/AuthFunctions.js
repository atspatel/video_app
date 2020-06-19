import {Alert} from 'react-native';
import axios from 'axios';

import * as Actions from './ActionTypes';
import * as myConfig from '../../config';
import * as RootNavigationRef from '../../RootNavigationRef';
import {setAuthorizationToken, setAnnToken} from './setAuthorizationToken';

const host = myConfig.host;

// export function post_activity(ann_token, type, link) {
//   const data = {
//     ann_token: ann_token,
//     type: type,
//     link: link,
//   };
//   const url = `${host}/activity_ops/post_activity/`;
//   axios.post(url, data, {headers: {'Content-type': 'application/json'}});
// }

export function showLogInAlert(cancel_fun) {
  Alert.alert(
    'You are not Logged In.',
    'Please Log In First.',
    [
      {
        text: 'Cancel',
        onPress: () => (cancel_fun ? cancel_fun() : null),
        style: 'cancel',
      },
      {
        text: 'LogIn',
        onPress: () => RootNavigationRef.navigate('LogIn'),
      },
    ],
    {cancelable: false},
  );
}

export function setToken(ann_token, token) {
  setAnnToken(ann_token);
  setAuthorizationToken(token);
}
export const getAnnToken = token => dispatch => {
  var headers = {'Content-type': 'application/json'};
  const url = `${host}/accounts/annonymous_login`;
  axios
    .get(url, {}, {headers: headers})
    .then(response => {
      setAnnToken(response.data.ann_token);
      dispatch({
        type: Actions.SET_ANNONYMOUS_TOKEN,
        status: response.data.status,
        ann_token: response.data.ann_token,
      });
    })
    .catch(error => console.error(error));
};

export const LogInFunc = (phone_number, otp) => dispatch => {
  axios
    .post(
      `${host}/accounts/login/`,
      {username: phone_number, password: otp},
      {
        headers: {'Content-type': 'application/json'},
      },
    )
    .then(response => {
      if (response.data.status) {
        setAuthorizationToken(response.data.token);
        setAnnToken(response.data.ann_token);
        dispatch({
          status: true,
          type: Actions.CALL_LOG_IN,
          token: response.data.token,
          user_id: response.data.user_id,
          user_name: response.data.user_name,
          ann_token: response.data.ann_token,
          phone_number: phone_number,
        });
      } else {
        dispatch({
          type: Actions.CALL_LOG_IN,
          status: false,
        });
      }
    })
    .catch(error => console.error(error));
};

export const LogOutfunc = token => dispatch => {
  axios
    .get(`${host}/accounts/logout`, {
      headers: {
        'Content-type': 'application/json',
      },
    })
    .then(response => {
      setAuthorizationToken(null);
      setAnnToken(response.data.ann_token);
      dispatch({
        type: Actions.CALL_LOG_OUT,
        ann_token: response.data.ann_token,
      });
    })
    .catch(error => {
      console.warn(error);
      setAuthorizationToken(null);
      dispatch({
        type: Actions.CALL_LOG_OUT,
      });
    });
};

export async function get_otp_function(PhoneNumber) {
  var output = null;
  const api_url = `${host}/accounts/get_otp/${PhoneNumber}`;
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

export const PostCreatorBio = form_state => dispatch => {
  var formData = new FormData();

  formData.append('first_name', form_state.FirstName.text);
  formData.append('last_name', form_state.LastName.text);
  formData.append('username', form_state.username.text);
  formData.append('about', form_state.about);
  formData.append(
    'languages',
    JSON.stringify(form_state.languages.selected_list),
  );
  formData.append(
    'categories',
    JSON.stringify(form_state.categories.selected_list),
  );

  if (form_state.avatar.type == 'image') {
    formData.append('image', {
      uri: form_state.avatar.image_uri.uri,
      type: form_state.avatar.image_uri.type,
      name: form_state.avatar.image_uri.fileName,
    });
  }
  const api_url = `${host}/keypoints/creators/`;
  return axios
    .post(api_url, formData, {})
    .then(response => {
      dispatch({
        type: Actions.SET_USERNAME,
        user_name: response.data.user_name,
      });
      return response.data;
    })
    .catch(error => console.error(error));
};

export const PostUserBio = form_state => dispatch => {
  var formData = new FormData();

  formData.append('first_name', form_state.FirstName.text);
  formData.append('last_name', form_state.LastName.text);

  if (form_state.avatar.type == 'image') {
    formData.append('image', {
      uri: form_state.avatar.image_uri.uri,
      type: form_state.avatar.image_uri.type,
      name: form_state.avatar.image_uri.fileName,
    });
  }
  const api_url = `${host}/accounts/post_bio/`;
  axios
    .post(api_url, formData, {})
    .then(response => {
      dispatch({
        type: Actions.SET_USERNAME,
        user_name: response.data.user_name,
      });
    })
    .catch(error => console.error(error));
};

export default LogInFunc;

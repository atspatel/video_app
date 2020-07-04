import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';

import * as myConfig from '../../config';
import axios from 'axios';

const host = myConfig.host;

export async function getToken() {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
    fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      // user has a device token
      console.log('fcmToken:', fcmToken);
      await AsyncStorage.setItem('fcmToken', fcmToken);
    }
  }
  console.log('fcmToken:', fcmToken);
  return fcmToken;
}

export async function post_token_mapping(fcmToken) {
  const data = {
    fcmToken: fcmToken,
  };
  const api_url = `${host}/firebase_ops/post_fcm_token/`;
  await axios.post(api_url, data);
}

export async function update_token_mapping() {
  getToken().then(fcmToken => post_token_mapping(fcmToken));
}

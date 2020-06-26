import Upload from 'react-native-background-upload';
import uuid from 'react-native-uuid';
import RNFetchBlob from 'react-native-fetch-blob';
import * as Actions from './ActionTypes';

import axios from 'axios';
import * as myConfig from '../../config';
import {Alert} from 'react-native';

const host = myConfig.host;

export async function upload_thumbnail(image_uri, video_id) {
  var formData = new FormData();
  formData.append('image', {
    uri: image_uri,
    type: 'image/jpeg',
    name: image_uri
      .split('\\')
      .pop()
      .split('/')
      .pop(),
  });
  const api_url = `${host}/keypoints/upload_thumbnail/`;
  return axios
    .post(api_url, formData)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error(error);
      return null;
    });
}

export const upload_video_data = (
  user_token,
  video_info,
  title,
  languages,
  categories,
  url_info,
) => dispatch => {
  dispatch({
    type: Actions.DELETE_VIDEO_DATA,
    video_data: video_info,
  });
  upload_thumbnail(video_info.thumbnail_path).then(response => {
    if (response.status) {
      const thumbnail_image = response.image_url;
      const session_id = uuid.v4();
      const options = {
        url: `${host}/keypoints/upload_video/`,
        path: video_info.filePath,
        method: 'POST',
        type: 'multipart',
        field: 'video_file',
        parameters: {
          thumbnail_image: thumbnail_image,
          title: title,
          languages: JSON.stringify(languages),
          categories: JSON.stringify(categories),
          url: url_info ? url_info : '',
          session: session_id,
        },
        maxRetries: 2,
        headers: {
          'content-type': 'application/octet-stream', // Customize content-type
          Authorization: `token ${user_token}`,
        },

        notification: {
          enabled: true,
        },
        useUtf8Charset: true,
      };

      Upload.startUpload(options)
        .then(uploadId => {
          console.log('Upload started');
          Upload.addListener('progress', uploadId, data => {
            console.log(`Progress: ${data.progress}%`);
          });
          Upload.addListener('error', uploadId, data => {
            console.log(`Error: ${data.error}%`);
          });
          Upload.addListener('cancelled', uploadId, data => {
            console.log(`Cancelled!`);
          });
          Upload.addListener('completed', uploadId, data => {
            // data includes responseCode: number and responseBody: Object
            console.log(`uploaded!`, data);
            const response = JSON.parse(data.responseBody);
            if (response.status) {
              Alert.alert(
                'Post created successfully.',
                '',
                [
                  {
                    text: 'Cancel',
                    onPress: () => (cancel_fun ? cancel_fun() : null),
                    style: 'cancel',
                  },
                  {
                    text: 'Ok',
                    onPress: () => null,
                  },
                ],
                {cancelable: false},
              );
              if (video_info.method === 'captured') {
                RNFetchBlob.fs.unlink(video_info.filePath);
                RNFetchBlob.fs.unlink(video_info.uri.replace('file://', ''));
                RNFetchBlob.fs.unlink(video_info.thumbnail_path);
              }
            } else {
              Alert.alert(
                response.message,
                '',
                [
                  {
                    text: 'Cancel',
                    onPress: () => (cancel_fun ? cancel_fun() : null),
                    style: 'cancel',
                  },
                  {
                    text: 'Ok',
                    onPress: () => null,
                  },
                ],
                {cancelable: false},
              );
              dispatch({
                type: Actions.ADD_VIDEO_DATA,
                video_data: video_info,
              });
            }
          });
        })
        .catch(err => {
          console.log('Upload error!', err);
        });
    }
  });
};

import Upload from 'react-native-background-upload';
import uuid from 'react-native-uuid';
import * as myConfig from '../../config';

const host = myConfig.host;
export const upload_video_data = video_info => {
  const session_id = uuid.v4();
  const options = {
    url: `${host}/keypoints/upload_video/`,
    path: video_info.path,
    method: 'POST',
    type: 'multipart',
    field: 'video_file',
    parameters: {title: video_info.title, session: session_id},
    maxRetries: 2,
    headers: {
      'content-type': 'application/octet-stream', // Customize content-type
      //   'my-custom-header': 's3headervalueorwhateveryouneed',
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
        console.log('Completed!');
      });
    })
    .catch(err => {
      console.log('Upload error!', err);
    });
};

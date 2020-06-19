import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob';

export function download_and_share_video(url, source) {
  RNFetchBlob.config({
    fileCache: true,
    appendExt: 'mp4',
  })
    .fetch('GET', url, {
      //some headers ..
    })
    .then(res => {
      return res.path();
    })
    .then(path => {
      share_post(`file://${path}`, source, true);
    });
}

export function share_post(filepath, source, to_delete) {
  var message = '';
  if (source) {
    message = `Source: ${source} \n Shared Via: Crat News http://bit.ly/CratConn`;
  } else {
    message = 'Shared Via: Crat News http://bit.ly/CratConn';
  }
  Share.open({url: filepath, message: message})
    .then(res => {
      if (to_delete) {
        RNFetchBlob.fs.unlink(filepath);
      }
    })
    .catch(err => {
      err && console.log(err);
    });
}

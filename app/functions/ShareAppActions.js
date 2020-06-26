import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob';

export async function download_and_share_video(
  url,
  title,
  ext_url,
  updateProgress,
  onShared,
) {
  if (url.endsWith('.mp4')) {
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'mp4',
    })
      .fetch('GET', url, {
        //some headers ..
      })
      .progress((received, total) => {
        if (updateProgress) {
          updateProgress(received / total);
        }
      })
      .then(res => {
        return res.path();
      })
      .then(path => {
        const filepath = `file://${path}`;
        share_post(filepath, title, ext_url, onShared).then(response => {
          RNFetchBlob.fs.unlink(filepath);
          onShared(response);
        });
      });
  } else {
    share_post(url, title, false, ext_url, onShared).then(response => {
      onShared(response);
    });
  }
}

export async function share_post(filepath, title, ext_url, onShared) {
  // var message = 'Shared Via: KeyPoints http://bit.ly/CratConn';
  let message = title ? title : '';
  if (ext_url && ext_url.length > 0) {
    message = `${message}..  To Know More: ${ext_url}`;
  }
  return Share.open({url: filepath, message: message})
    .then(res => {
      return true;
    })
    .catch(err => {
      err && console.log(err);
      return false;
    });
}

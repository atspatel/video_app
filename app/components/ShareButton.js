//import liraries
import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';
import {ShareIcon} from '../constants/icon';

import {DownloadCircularBar} from './VideoCircularProgressBar';
import {download_and_share_video} from '../functions/ShareAppActions';

// create a component

export class ShareFAB extends Component {
  state = {};
  onPressShare = () => {
    if (this.props.onPress) {
      this.props.onPress();
    }
  };
  render() {
    return (
      <FAB
        style={styles.fabButton}
        small
        icon={props => {
          return (
            <ShareIcon
              size={30}
              color="black"
              style={{
                margin: -10,
                alignSelf: 'center',
                alignItems: 'center',
              }}
            />
          );
        }}
        color={'white'}
        onPress={this.onPressShare.bind(this)}
      />
    );
  }
}

class ShareButton extends Component {
  state = {isSharing: false, progress: 0};
  onShared = action => {
    this.setState({isSharing: false, progress: 0});
  };

  updateProgess = progress => {
    this.setState({progress: progress});
    // console.warn(progress, 'progress');
  };
  onClickShare = () => {
    const {video_info} = this.props;
    if (video_info) {
      this.setState({isSharing: true});
      download_and_share_video(
        video_info.share_url,
        video_info.title,
        video_info.external_urls,
        this.updateProgess,
        this.onShared,
      );
    }
  };
  render() {
    const {video_info} = this.props;
    const {isSharing, progress} = this.state;
    return (
      <View>
        {isSharing ? (
          <DownloadCircularBar current={progress} total={1} />
        ) : (
          <ShareFAB onPress={this.onClickShare} />
        )}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  fabButton: {
    padding: 0,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: 'white',
    borderColor: 'black',
  },
});

//make this component available to the app
export default ShareButton;

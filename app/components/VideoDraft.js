//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  BackHandler,
  Alert,
} from 'react-native';
import Video from 'react-native-video';
import Modal from 'react-native-modal';
import VideoCircularProgressBar from './VideoCircularProgressBar';
import {PlayIcon} from '../constants/icon';

import {DeleteIcon} from '../constants/icon';
const {width: winWidth, height: winHeight} = Dimensions.get('window');

// create a component
class VideoDraftPlayer extends Component {
  state = {
    duration: 0,
    current: 0,
    paused: false,
  };
  handleOnLoad = meta => {
    this.setState({duration: meta.duration});
  };

  handleProgress = progress => {
    this.setState({
      current: progress.currentTime,
    });
  };

  render() {
    const {video_info} = this.props;
    const {current, duration, paused} = this.state;
    return (
      <View style={{flex: 1}}>
        <Video
          source={{uri: video_info.uri}} // Can be a URL or a local file.
          ref={ref => {
            this.player = ref;
          }} // Store reference
          //   controls={true}
          resizeMode={'contain'}
          style={styles.video_player}
          onLoad={this.handleOnLoad}
          progressUpdateInterval={500.0}
          onProgress={this.handleProgress}
          paused={paused}
        />
        <View style={styles.overlay}>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => {
              this.setState({paused: !this.state.paused});
            }}>
            {paused ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <PlayIcon />
              </View>
            ) : (
              <View style={{flex: 1}}></View>
            )}
          </TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
              alignContent: 'center',
              marginBottom: 15,
            }}>
            <VideoCircularProgressBar current={current} total={duration} />
          </View>
        </View>
      </View>
    );
  }
}

export class VideoPlayerModal extends Component {
  render() {
    const {
      isVisible,
      closeModal,
      video_info,
      onDelete,
      onClickCreatePost,
    } = this.props;
    return (
      <Modal
        isVisible={isVisible}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        animationOutTiming={500}
        backdropTransitionOutTiming={0}
        backdropColor={'black'}
        onRequestClose={closeModal}
        style={{
          flex: 1,
          margin: 0,
          backgroundColor: 'white',
        }}>
        {isVisible && video_info ? (
          <View style={{flex: 1}}>
            <VideoDraftPlayer video_info={video_info} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              {onDelete ? (
                <DeleteIcon
                  size={50}
                  onPress={() => {
                    onDelete(video_info);
                  }}
                />
              ) : null}
              {onClickCreatePost ? (
                <TouchableOpacity
                  onPress={() => {
                    onClickCreatePost(video_info);
                  }}>
                  <Text
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      color: 'white',
                      backgroundColor: '#d12e61',
                      fontFamily: 'serif',
                      fontSize: 18,
                    }}>
                    Create Post
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ) : null}
      </Modal>
    );
  }
}

class VideoDraft extends Component {
  state = {
    video_list: [],
    current_video: null,
    isPlay: false,
  };

  onDelete = video_info => {
    this.setState({isPlay: false, current_video: null});
    let {video_list} = this.state;
    video_list = video_list.filter(i => i != video_info);
    this.props.setVideoList(video_list);
  };

  goToEditPage = video_info => {
    this.setState({isPlay: false});
    this.props.navigation.navigate('VideoEditor', {video_info: video_info});
  };

  closeModal = () => {
    this.setState({isPlay: false, current_video: null});
  };

  componentDidUpdate() {
    const {video_list} = this.props;
    if (this.state.video_list != video_list) {
      this.setState({video_list: video_list}, () => {
        if (this.state.video_list && this.state.video_list.length === 0) {
          this.props.navigation.navigate('VideoRecorder');
        }
      });
    }
  }
  componentDidMount() {
    this.componentDidUpdate();
    // BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.handleBackButtonClick,
    // );
  }

  componentWillUnmount() {
    // BackHandler.removeEventListener('hardwareBackPress', () => {
    //   this.handleBackButtonClick;
    // });
  }
  render() {
    const {video_list, current_video, isPlay} = this.state;
    return (
      <View style={styles.container}>
        <VideoPlayerModal
          isVisible={isPlay}
          closeModal={this.closeModal}
          video_info={current_video}
          onDelete={this.onDelete}
          onClickCreatePost={this.goToEditPage}
        />
        {video_list.length > 0 ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              padding: 10,
            }}>
            {video_list.map((item, index) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    this.setState({current_video: item, isPlay: true});
                  }}>
                  <Image
                    source={{uri: item.thumbnail_path}}
                    key={index}
                    style={{
                      height: 200,
                      width: 112,
                      marginRight: 10,
                      resizeMode: 'contain',
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('VideoRecorder')}>
            <Text>camera</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // padding: 10,
  },
  video_player: {
    backgroundColor: 'white',
    width: winWidth,
    height: winHeight - 100,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
});

import {connect} from 'react-redux';
import {setVideoList} from '../functions/CreateVideoFunctions';
const mapStateToProps = state => ({
  video_list: state.CreateVideoReducer.video_list,
});

export default connect(mapStateToProps, {setVideoList})(VideoDraft);
//make this component available to the app
// export default VideoDraft;

//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Image,
  Dimensions,
  Alert,
  PermissionsAndroid,
} from 'react-native';

import {RNCamera} from 'react-native-camera';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import uuid from 'react-native-uuid';

import VideoPickerButton from './VideoPickerButton';
import RNThumbnail from 'react-native-thumbnail';
import RNGRP from 'react-native-real-path';
import moment from 'moment';

const {Type, FlashMode} = RNCamera.Constants;
const {VideoQuality} = RNCamera.Constants;
const {width: winWidth, height: winHeight} = Dimensions.get('window');

const RATIO = 1.25;
const HEIGHT = RATIO * winWidth;
// create a component

const MAX_DURATION = 90;
class VideoRecorder extends Component {
  constructor() {
    super();
    this.state = {
      recording: false,
      isCameraVisible: true,
      CameraType: Type.front,
      flashMode: FlashMode.off,
      video_list: [],
      duration: 0,
    };

    this.setCameraType = this.setCameraType.bind(this);
    this.setFlashMode = this.setFlashMode.bind(this);
  }

  checkPermission_and_add_video_uri = (uri, type, fileName, method) => {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ).then(response => {
      if (response) {
        this.add_video_uri(uri, type, fileName, method);
      } else {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ).then(response => {
          console.warn(response, 'granted');
          if (response === PermissionsAndroid.RESULTS.GRANTED) {
            this.add_video_uri(uri, type, fileName, method);
          } else {
            Alert.alert(
              'Need Local Storage Permission. Please allow it from settings.',
              '',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    this.props.navigation.navigate('BottomNavigation');
                  },
                },
              ],
              {cancelable: false},
            );
          }
        });
      }
    });
  };
  add_video_uri = (uri, type, fileName, method, path) => {
    let thumbnail_path;
    RNGRP.getRealPathFromURI(uri).then(filePath =>
      RNThumbnail.get(filePath).then(result => {
        thumbnail_path = result.path;
        const id = uuid.v4();
        const video_info = {
          id: id,
          uri: uri,
          method: method,
          filePath: filePath,
          type: type ? type : 'video/mp4',
          fileName: fileName ? fileName : `${id}.mp4`,
          thumbnail_path: thumbnail_path,
          recorded_time: moment().utcOffset('+05:30'),
        };
        const video_list = [video_info, ...this.state.video_list];
        this.props.setVideoList(video_list);
      }),
    );
  };
  start_timer = () => {
    this.setState({duration: 0});
    this._interval = setInterval(() => {
      this.setState({duration: this.state.duration + 1});
    }, 1000);
  };
  stop_timer = () => {
    if (this._interval) {
      clearInterval(this._interval);
      this.setState({duration: 0});
    }
  };

  setCameraType() {
    if (this.state.CameraType === Type.front) {
      this.setState({CameraType: Type.back});
    } else {
      this.setState({CameraType: Type.front});
    }
  }

  setFlashMode() {
    if (this.state.flashMode === FlashMode.off) {
      this.setState({flashMode: FlashMode.auto});
    } else if (this.state.flashMode === FlashMode.torch) {
      this.setState({flashMode: FlashMode.off});
    } else {
      this.setState({flashMode: FlashMode.torch});
    }
  }

  // takePicture() {
  //   const options = {};
  //   //options.location = ...
  //   this.camera
  //     .capture({metadata: options})
  //     .then(data => {
  //       console.log(data);
  //       this.setState({isCameraVisible: false});
  //     })
  //     .catch(err => console.error(err));
  // }
  takeVideo = async () => {
    if (this.camera) {
      try {
        this.setState({recording: true});
        const options = {
          quality: VideoQuality['720p'],
          videoBitrate: 2000000,
          maxDuration: MAX_DURATION,
        };
        this.start_timer();
        const promise = this.camera.recordAsync(options);
        if (promise) {
          const data = await promise;
          this.checkPermission_and_add_video_uri(
            data.uri,
            null,
            null,
            'captured',
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  stoprec = async () => {
    this.setState({recording: false});
    this.stop_timer();
    await this.camera.stopRecording();
  };

  toggle_recording = () => {
    if (this.state.recording) {
      // this.setState({isCameraVisible: false}, () => this.stoprec());
      this.stoprec();
    } else {
      this.takeVideo();
    }
  };

  onClickEditDraft = () => {
    console.warn(this.props.video_list.length, '----');
    if (this.props.video_list.length === 1) {
      this.props.navigation.navigate('VideoEditor', {
        video_info: this.props.video_list[0],
      });
    } else {
      this.props.navigation.navigate('VideoDraft');
    }
  };
  handleBackButtonClick = () => {
    if (this.state.recording) {
      this.stoprec();
      return true;
    }
    // else if (this.state.video_uri.length > 0) {
    //   this.setState({video_uri: []});
    //   return true;
    // }
    return false;
  };

  componentDidUpdate() {
    if (this.state.duration >= MAX_DURATION) {
      this.setState({duration: 0}, () => {
        this.stoprec().then(() => {
          this.takeVideo();
        });
      });
    }
    const {video_list} = this.props;
    if (this.state.video_list !== video_list) {
      this.setState({video_list: video_list});
    }
  }

  componentDidMount() {
    this.componentDidUpdate();
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }
  componentWillUnmount() {
    if (this.state.recording) {
      this.stoprec();
      this.stop_timer();
    }
    BackHandler.removeEventListener('hardwareBackPress', () => {
      this.handleBackButtonClick;
    });
  }
  render() {
    const {CameraType, flashMode, video_list, duration} = this.state;
    let flash_icon = 'flash-off';
    if (flashMode == FlashMode.torch) {
      flash_icon = 'flash';
    } else if (flashMode == FlashMode.auto) {
      flash_icon = 'flash-auto';
    }

    const isStart = duration && duration < 10;
    const willEnd = duration && MAX_DURATION - duration < 10;
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          type={CameraType}
          flashMode={flashMode}
          style={styles.container}>
          {/* <View style={styles.mask} /> */}
          {video_list.length > 0 ? (
            <View style={styles.recorder_video_bar}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                {video_list.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={this.onClickEditDraft}>
                      <Image
                        source={{uri: item.thumbnail_path}}
                        key={index}
                        style={{
                          height: 70,
                          width: 40,
                          marginRight: 10,
                          resizeMode: 'contain',
                          backgroundColor: '#DDD',
                        }}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TouchableOpacity onPress={this.onClickEditDraft}>
                <Text
                  style={{
                    fontSize: 20,
                    alignSelf: 'center',
                    color: 'white',
                    backgroundColor: 'lightblue',
                    padding: 5,
                    borderRadius: 5,
                  }}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.bottomBar}>
            <View style={{flex: 1}}>
              {this.state.recording ? null : (
                <VideoPickerButton onSelectVideo={this.add_video_uri} />
              )}
            </View>
            <TouchableOpacity
              style={{flex: 1, alignItems: 'center'}}
              activeOpacity={0.2}
              onPress={this.toggle_recording.bind(this)}>
              <View
                style={{
                  height: 66,
                  width: 66,
                  borderRadius: 33,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AnimatedCircularProgress
                  size={60}
                  width={3}
                  fill={
                    this.state.duration
                      ? (1 - this.state.duration / MAX_DURATION) * 100
                      : 0
                  }
                  tintColor={isStart ? 'green' : willEnd ? 'red' : 'black'}
                  backgroundColor="#FFFFFF">
                  {fill => (
                    <View
                      style={{
                        backgroundColor: isStart
                          ? 'lightgreen'
                          : willEnd
                          ? 'pink'
                          : 'white',
                        height: 60,
                        width: 60,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 20,
                          color: 'black',
                          fontWeight: 'bold',
                        }}>
                        {this.state.duration}
                      </Text>
                    </View>
                  )}
                </AnimatedCircularProgress>
              </View>
            </TouchableOpacity>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              {this.state.recording ? null : (
                <TouchableOpacity onPress={this.setFlashMode.bind(this)}>
                  <MaterialCommunityIcons
                    name={flash_icon}
                    color="white"
                    size={30}
                  />
                </TouchableOpacity>
              )}
              {this.state.recording ? null : (
                <TouchableOpacity
                  style={{alignItems: 'center'}}
                  onPress={this.setCameraType}>
                  <MaterialCommunityIcons
                    name="autorenew"
                    color="white"
                    size={30}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </RNCamera>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'white',
  },
  recorder_video_bar: {
    position: 'absolute',
    height: 80,
    width: '100%',
    bottom: 80,
    left: 0,
    flexDirection: 'row',

    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: HEIGHT,
    width: winWidth,
    borderWidth: 2,
    borderColor: 'white',
  },
  bottomBar: {
    position: 'absolute',
    height: 80,
    width: '100%',
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});

//make this component available to the app
import {connect} from 'react-redux';
import {setVideoList} from '../functions/CreateVideoFunctions';
const mapStateToProps = state => ({
  video_list: state.CreateVideoReducer.video_list,
});

export default connect(mapStateToProps, {setVideoList})(VideoRecorder);
// export default Video/Recorder;

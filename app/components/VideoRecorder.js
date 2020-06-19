//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Image,
} from 'react-native';

import {RNCamera} from 'react-native-camera';
import Video from 'react-native-video';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import uuid from 'react-native-uuid';

import VideoPickerButton from './VideoPickerButton';
import RNThumbnail from 'react-native-thumbnail';
import RNGRP from 'react-native-real-path';

import {upload_video_data} from '../functions/VideoUploadApi';

const {Type, FlashMode} = RNCamera.Constants;
const {width: winWidth, height: winHeight} = Dimensions.get('window');
// create a component

const MAX_DURATION = 30;
class VideoRecorder extends Component {
  constructor() {
    super();
    this.state = {
      recording: false,
      isCameraVisible: true,
      CameraType: Type.front,
      flashMode: FlashMode.off,
      videos_list: [],
      duration: 0,
    };

    this.setCameraType = this.setCameraType.bind(this);
    this.setFlashMode = this.setFlashMode.bind(this);
  }

  add_video_uri = (uri, type, fileName) => {
    let thumbnail_path;
    RNGRP.getRealPathFromURI(uri).then(filePath => {
      RNThumbnail.get(filePath).then(result => {
        thumbnail_path = result.path;
        const video_info = {
          path: filePath,
          uri: uri,
          type: type ? type : 'video/mp4',
          fileName: fileName ? fileName : `${uuid.v4()}.mp4`,
          thumbnail_path: thumbnail_path,
          title: 'This is test title...',
        };
        this.setState({videos_list: [...this.state.videos_list, video_info]});
      });
    });
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

  takePicture() {
    const options = {};
    //options.location = ...
    this.camera
      .capture({metadata: options})
      .then(data => {
        console.log(data);
        this.setState({isCameraVisible: false});
      })
      .catch(err => console.error(err));
  }
  takeVideo = async () => {
    if (this.camera) {
      try {
        this.setState({recording: true});
        const options = {
          quality: 0.5,
          videoBitrate: 8000000,
          maxDuration: MAX_DURATION,
        };
        this.start_timer();
        const promise = this.camera.recordAsync(options);
        if (promise) {
          const data = await promise;
          this.add_video_uri(data.uri);
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

  upload_video = () => {
    const video_data = this.state.videos_list[0];
    upload_video_data(video_data);
  };
  handleBackButtonClick = () => {
    if (this.state.recording) {
      this.setState({isCameraVisible: false}, () => this.stoprec());
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
  }

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }
  componentWillUnmount() {
    if (this.state.recording) {
      this.setState({isCameraVisible: false}, () => {
        this.stoprec();
      });
    }
    BackHandler.removeEventListener('hardwareBackPress', () => {
      this.handleBackButtonClick;
    });
  }
  render() {
    const {
      CameraType,
      isCameraVisible,
      flashMode,
      videos_list,
      duration,
    } = this.state;
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
        {isCameraVisible ? (
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            type={CameraType}
            flashMode={flashMode}
            style={styles.container}>
            <View style={styles.recorder_video_bar}>
              {videos_list.map((item, index) => {
                return (
                  <Image
                    source={{uri: item.thumbnail_path}}
                    key={index}
                    style={{
                      height: 80,
                      width: 45,
                      marginRight: 10,
                      resizeMode: 'contain',
                      backgroundColor: '#DDD',
                    }}
                  />
                );
              })}
              <TouchableOpacity onPress={this.upload_video}>
                <Text style={{fontSize: 20, alignSelf: 'center'}}>Upload</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bottomBar}>
              <View style={{flex: 1}}>
                <VideoPickerButton onSelectVideo={this.add_video_uri} />
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
                <TouchableOpacity onPress={this.setFlashMode.bind(this)}>
                  <MaterialCommunityIcons
                    name={flash_icon}
                    color="white"
                    size={30}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{alignItems: 'center'}}
                  onPress={this.setCameraType}>
                  <MaterialCommunityIcons
                    name="autorenew"
                    color="white"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </RNCamera>
        ) : videos_list.length > 0 ? (
          <View>
            <Video
              source={{uri: videos_list[0].uri}}
              resizeMode="contain"
              style={{
                height: winHeight - 100,
                width: winWidth,
                position: 'relative',
                top: 0,
                left: 0,
              }}
              controls={true}
            />
            <TouchableOpacity onPress={this.upload_video}>
              <Text style={{fontSize: 20, alignSelf: 'center'}}>Upload</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableHighlight
            onPress={() => this.setState({isCameraVisible: true})}>
            <Text>camera</Text>
          </TouchableHighlight>
        )}
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
    paddingHorizontal: 50,
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
  },
});

//make this component available to the app
export default VideoRecorder;

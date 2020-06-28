import Video from 'react-native-video';
import YouTube from 'react-native-youtube';
//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import FollowButton from './FollowButtonTwo';
import ProfilePic from './ProfilePic';
import WebViewer from '../screens/WebViewer';
import {setVolume} from '../functions/SystemFunctions';
import * as RootNavigationRef from '../../RootNavigationRef';

import * as config from '../../config';

const {width: winWidth, height: winHeight} = Dimensions.get('window');

class VideoPlayerComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paused: true,
      volume: 0,
      duration: 0,
      current: 0,
      isBuffering: false,

      displayUrl: null,
      showButton: false,
    };

    this.toggle_pause = this.toggle_pause.bind();
  }

  openURL(url) {
    RootNavigationRef.navigate('WebViewer', {url: url});
  }

  onEnd = () => {
    if (this.props.video_info.source !== 'youtube') {
      this.player.seek(0);
    }
    this.setState({paused: true});
    if (this.props.onEnd) {
      this.props.onEnd();
    }
  };
  toggle_pause = () => {
    this.setState({paused: !this.state.paused});
  };

  onVoumeChange = () => {
    this.props.setVolume(Number(!this.state.volume));
  };

  onClickUser = user_info => {
    if (this.props.onClickUser) {
      return this.props.onClickUser(user_info);
    }
  };

  onClickFollow = (action, user_info) => {
    if (this.props.onClickFollow) {
      return this.props.onClickFollow(action, user_info);
    }
  };

  handleOnLoad = meta => {
    this.setState({duration: meta.duration});
  };

  onReadyYoutube = () => {
    this.player.getDuration().then(duration => {
      this.setState({duration: duration});
    });
  };
  onChangeStateYoutube = e => {
    this.player.getCurrentTime().then(currentTime => {
      if (currentTime != 0) {
        this.state.duration - currentTime === 0 ? this.onEnd() : null;
      }
    });
  };

  handleProgress = progress => {
    this.setState({
      current: progress.currentTime,
    });
  };

  // onPlayForward = () => {
  //   let curr = Math.min(this.state.current + 5, this.state.duration);
  //   this.player.seek(parseInt(curr));
  // };
  // onPlayBackward = () => {
  //   let curr = Math.max(this.state.current - 5, 0);
  //   this.player.seek(parseInt(curr));
  // };
  componentDidUpdate(prevProps) {
    const {duration, current, showButton, displayUrl} = this.state;
    if (duration && duration - current < 15 && !showButton && displayUrl) {
      this.setState({showButton: true});
    }
    if (duration && duration - current > 15 && showButton) {
      this.setState({showButton: false});
    }
    if (prevProps.paused !== this.props.paused) {
      this.setState({paused: this.props.paused}, () => {
        this.props.video_info.source != 'youtube' && this.player.seek(0);
      });
    }
    if (this.state.volume != this.props.volume) {
      this.setState({volume: this.props.volume});
    }
  }
  componentDidMount() {
    const displayUrl = this.props.video_info.external_urls;
    this.setState({
      paused: this.props.paused,
      volume: this.props.volume,
      displayUrl: displayUrl,
    });
  }

  renderYTPlayer() {
    const {video_info, height} = this.props;
    return (
      <YouTube
        ref={c => (this.player = c)}
        apiKey={config.google_key}
        videoId={video_info.video_id} // The YouTube video ID
        play
        // controls={0}
        showFullscreenButton={false}
        onReady={this.onReadyYoutube}
        onChangeState={this.onChangeStateYoutube}
        style={{
          alignSelf: 'stretch',
          width: winWidth,
          height: height - 50,
        }}
        onError={e => console.log(e)}
      />
    );
  }
  renderVideoPlayer() {
    const {video_info, height} = this.props;
    const {paused, showButton, displayUrl, volume} = this.state;
    return (
      <TouchableOpacity onPress={this.toggle_pause} activeOpacity={0.9}>
        <Video
          ref={c => (this.player = c)}
          source={{uri: video_info.url}}
          hls={true}
          resizeMode="contain"
          onLoad={this.handleOnLoad}
          progressUpdateInterval={500.0}
          onProgress={this.handleProgress}
          poster={video_info.thumbnail_image}
          posterResizeMode={'stretch'}
          style={{
            width: winWidth,
            height: height,
            borderRadius: 10,
            backgroundColor: 'black',
          }}
          bufferConfig={{minBufferMs: 1000, maxBufferMs: 5000}}
          paused={paused}
          onEnd={this.onEnd}
          volume={volume}
          maxBitRate={0}></Video>
        {paused ? (
          <View style={styles.overlay_play}>
            <MaterialCommunityIcons name={'play'} color="white" size={100} />
          </View>
        ) : null}
        {showButton ? (
          <View style={styles.overlay_button}>
            <TouchableOpacity
              style={{
                backgroundColor: '#DDD',
                padding: 5,
                paddingHorizontal: 20,
                borderRadius: 10,
              }}
              onPress={() => {
                this.openURL(displayUrl);
              }}>
              <Text style={{fontSize: 20, fontFamily: 'serif'}}>
                Watch More Here
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  }
  render() {
    const {video_info, paused, onEnd, height} = this.props;
    const isYouTube = video_info.source === 'youtube' ? true : false;
    const {volume, displayUrl} = this.state;
    return (
      <View style={[styles.container, {height: height}]}>
        {isYouTube && !paused
          ? this.renderYTPlayer()
          : this.renderVideoPlayer()}
        <View style={styles.overlay_bar}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            {isYouTube ? null : (
              <TouchableOpacity onPress={this.onVoumeChange}>
                <MaterialCommunityIcons
                  name={volume ? 'volume-high' : 'volume-off'}
                  size={35}
                  color={'white'}
                  style={{paddingLeft: 20}}
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              // flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {isYouTube ? null : (
              <AnimatedCircularProgress
                size={50}
                width={3}
                fill={
                  this.state.current
                    ? (1 - this.state.current / this.state.duration) * 100
                    : 100
                }
                tintColor="white"
                backgroundColor="#999">
                {fill => (
                  <View
                    style={{
                      backgroundColor: '#999',
                      height: 50,
                      width: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      adjustsFontSizeToFit={true}
                      style={{
                        fontSize: 20,
                        color: 'black',
                        fontWeight: 'bold',
                      }}>
                      {parseInt(this.state.duration - this.state.current)}
                    </Text>
                  </View>
                )}
              </AnimatedCircularProgress>
            )}
          </View>
          <TouchableOpacity
            onPress={() => {
              this.onClickUser(video_info.user);
            }}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
              marginRight: 10,
              borderRadius: 20,
              justifyContent: 'flex-end',
              backgroundColor: '#DDD',
              overflow: 'hidden',
            }}>
            <View>
              <Text
                style={{color: 'black', justifyContent: 'center'}}
                numberOfLines={1}>
                {video_info.user.name.substring(0, 15)}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: 'black', marginRight: 3}}>
                  {video_info.user.followers ? video_info.user.followers : 0}
                </Text>
                <FollowButton
                  style={{width: 80}}
                  qid={video_info.user.id}
                  qcat={'user'}
                  isSelf={
                    video_info.user.follow_status == 'self' ? true : false
                  }
                />
                {/* <FontAwesome5 name="users" size={15} color={'black'} /> */}
              </View>
            </View>
            <View
              style={{
                // flex: 1,
                height: 50,
                width: 50,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 25,
                backgroundColor: 'white',
                borderWidth: 2,
                borderColor: 'black',
              }}>
              <ProfilePic
                profile_pic={video_info.user.profile_pic}
                user_name={video_info.user.name}
                size={44}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'black',
  },
  overlay_play: {
    position: 'absolute',
    height: '100%',
    width: '100%',

    top: 0,
    left: 0,

    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  overlay_button: {
    position: 'absolute',
    height: 50,
    width: '100%',

    bottom: 60,
    left: 0,

    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  overlay_bar: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    position: 'absolute',
    // paddingBottom: 10,
    bottom: 0,
    right: 0,
    opacity: 1.0,
    backgroundColor: 'rgba(0, 0,  0, 0.3)',
  },
});

//make this component available to the app
// export default VideoPlayerComp;

import {connect} from 'react-redux';

const mapStateToProps = state => ({
  volume: state.SystemReducer.volume,
});

export default connect(mapStateToProps, {setVolume})(VideoPlayerComp);

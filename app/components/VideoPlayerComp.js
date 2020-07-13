import Video from 'react-native-video';
//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Animated,
} from 'react-native';
import {connect} from 'react-redux';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import FollowButton from './FollowButtonTwo';
import ProfilePic from './ProfilePic';
import UserVideoBottomFeed from './UserVideoBottomFeed';
import {setVolume} from '../functions/SystemFunctions';
import * as RootNavigationRef from '../../RootNavigationRef';
import {LikeIcon} from '../constants/icon';
import ShareButton from './ShareButton';
import VideoCircularProgressBar from './VideoCircularProgressBar';
import * as theme from '../constants/theme';

const {width: winWidth, height: winHeight} = Dimensions.get('window');

class VideoPlayerSideBar extends Component {
  state = {
    volume: 0,
    isSharing: false,
  };

  onVoumeChange = () => {
    this.props.setVolume(Number(!this.state.volume));
  };

  onClickLike = (id, action) => {
    if (this.props.onClickLike) {
      this.props.onClickLike(id, action);
    }
  };

  componentDidUpdate() {
    const {volume} = this.props;
    if (this.state.volume != volume) {
      this.setState({volume: this.props.volume});
    }
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  render() {
    const {volume} = this.props;
    const {video_info, current, total} = this.props;
    return (
      <View style={[styles.sidebar]}>
        <ShareButton video_info={video_info} />
        <TouchableOpacity
          onPress={() =>
            this.onClickLike(
              video_info.id,
              video_info.liked ? 'unlike' : 'like',
            )
          }
          style={{marginVertical: 5}}>
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              backgroundColor: video_info.liked ? 'lightblue' : 'white',
              borderRadius: 20,
            }}>
            <LikeIcon size={30} color="black" />
            {video_info.likes > 0 ? (
              <Text
                allowFontScaling={true}
                style={{marginTop: -5, paddingBottom: 5}}>
                {video_info.likes}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onVoumeChange}
          style={{marginVertical: 5}}>
          <MaterialCommunityIcons
            name={volume ? 'volume-high' : 'volume-off'}
            // size={35}
            // color={'white'}
            size={30}
            color="black"
            style={{
              padding: 5,
              alignSelf: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 20,
            }}
          />
        </TouchableOpacity>
        <VideoCircularProgressBar
          size={40}
          current={current}
          total={total}
          style={{marginTop: 5}}
        />
      </View>
    );
  }
}
const mapStateToProps = state => ({
  volume: state.SystemReducer.volume,
});
const ConnectedVideoPlayerSideBar = connect(mapStateToProps, {setVolume})(
  VideoPlayerSideBar,
);

class VideoPlayerBottomBar extends Component {
  onClickUser = user_info => {
    RootNavigationRef.navigate('CreatorProfile', {user: user_info.id});
  };
  render() {
    const {isOpen, onClick, title, user_info} = this.props;
    return (
      <View style={styles.overlay_bar}>
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 5,
            alignItems: 'center',
          }}
          onPress={onClick}>
          <TouchableOpacity onPress={() => this.onClickUser(user_info)}>
            <ProfilePic
              profile_pic={user_info.profile_pic}
              user_name={user_info.name}
              size={50}
            />
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              margin: 5,
            }}>
            <Text style={styles.title_text} numberOfLines={1}>
              {title}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  flex: 1,
                  color: 'black',
                  fontSize: 16,
                  fontFamily: theme.fontFamily,
                  fontWeight: 'bold',
                  marginLeft: 5,
                }}
                numberOfLines={1}>
                {user_info.name.substring(0, 15)}
              </Text>
              <View
                style={{
                  flex: 1,
                }}>
                <FollowButton
                  style={{width: 80}}
                  qid={user_info.id}
                  qcat={'user'}
                  isSelf={user_info.follow_status == 'self' ? true : false}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {isOpen ? <UserVideoBottomFeed user_id={user_info.id} /> : null}
      </View>
    );
  }
}

class VideoPlayerComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paused: true,
      volume: 0,
      duration: 0,
      current: 0,
      isBuffering: false,
      showButton: false,
      isBottomBarOpen: false,

      animationVal: new Animated.Value(0),
    };
  }

  _resetAnimation = () => {
    this.state.animationVal.setValue(0);
  };
  _startAnimation = () => {
    Animated.timing(this.state.animationVal, {
      toValue: 220,
      duration: 3000,
      // useNativeDriver: true,
    }).start();
  };

  toggleBottomMenu = () => {
    this.setState({isBottomBarOpen: !this.state.isBottomBarOpen});
  };
  openURL(url) {
    RootNavigationRef.navigate('WebViewer', {url: url});
  }

  onEnd = () => {
    this.player.seek(0);
    this.setState({paused: true});
    if (this.props.onEnd) {
      this.props.onEnd();
    }
  };
  toggle_pause = () => {
    if (this.state.isBottomBarOpen) {
      this.setState({isBottomBarOpen: false});
    } else {
      this.setState({paused: !this.state.paused});
    }
  };

  handleOnLoad = meta => {
    this.setState({duration: meta.duration});
  };

  onBuffer = () => {};

  handleProgress = progress => {
    this.setState({
      current: progress.currentTime,
    });
  };

  componentDidUpdate(prevProps) {
    const {duration, current, showButton} = this.state;
    const {external_urls: displayUrl} = this.props.video_info;
    if (duration && duration - current < 20 && !showButton && displayUrl) {
      this.setState({showButton: true}, () => this._startAnimation());
    }
    if (duration && duration - current > 20 && showButton) {
      this.setState({showButton: false}, () => this._resetAnimation());
    }
    if (prevProps.paused !== this.props.paused) {
      this.setState({paused: this.props.paused}, () => {
        this.player.seek(0);
      });
    }
    if (this.state.volume != this.props.volume) {
      this.setState({volume: this.props.volume});
    }
  }

  handleBackButtonClick = () => {
    if (this.state.isBottomBarOpen) {
      this.setState({isBottomBarOpen: false});
      return true;
    }
    return false;
  };

  componentDidMount() {
    this.setState({
      paused: this.props.paused,
      volume: this.props.volume,
    });
  }
  componentWillUnmount() {
    // this.backHandler && this.backHandler.remove();
  }

  renderVideoPlayer() {
    const {video_info, height} = this.props;
    const {paused, volume} = this.state;
    return (
      <Video
        ref={c => (this.player = c)}
        source={{uri: video_info.url}}
        hls={true}
        resizeMode="contain"
        onLoad={this.handleOnLoad}
        progressUpdateInterval={500.0}
        onProgress={this.handleProgress}
        onBuffer={this.onBuffer}
        poster={video_info.thumbnail_image}
        posterResizeMode={'stretch'}
        style={{
          width: winWidth,
          height: height - 20,
          borderRadius: 10,
          backgroundColor: 'black',
        }}
        bufferConfig={{minBufferMs: 1000, maxBufferMs: 5000}}
        paused={paused}
        onEnd={this.onEnd}
        volume={volume}
        maxBitRate={0}
      />
    );
  }
  render() {
    const {video_info, height, onClickLike} = this.props;
    const {paused, volume, showButton} = this.state;
    return (
      <View style={[styles.container, {height: height}]}>
        <TouchableOpacity onPress={this.toggle_pause} activeOpacity={0.9}>
          {this.renderVideoPlayer()}
          {paused ? (
            <View style={styles.overlay_play}>
              <MaterialCommunityIcons name={'play'} color="white" size={100} />
            </View>
          ) : null}
          {showButton ? (
            <Animated.View
              style={[
                styles.overlay_button,
                {
                  position: 'absolute',
                  bottom: 100,
                  left: 0,
                  width: this.state.animationVal,
                  overflow: 'hidden',
                },
              ]}>
              <TouchableOpacity
                style={{
                  backgroundColor: theme.logoColor,
                  paddingHorizontal: 0,
                  borderRadius: 20,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
                onPress={() => {
                  this.openURL(video_info.external_urls);
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 20,
                    fontFamily: theme.fontFamily,
                    fontWeight: 'bold',
                    marginRight: 5,
                    color: 'white',
                  }}>
                  See more of this
                </Text>
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 20,
                    // borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                  }}>
                  <MaterialCommunityIcons
                    name={'information-variant'}
                    size={30}
                    color={'black'}
                  />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ) : null}
        </TouchableOpacity>
        <ConnectedVideoPlayerSideBar
          video_info={video_info}
          current={this.state.current}
          total={this.state.duration}
          onClickLike={onClickLike}
        />
        <VideoPlayerBottomBar
          isOpen={this.state.isBottomBarOpen}
          onClick={this.toggleBottomMenu}
          title={video_info.title}
          user_info={video_info.user}
        />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
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
    // height: 50,
    // width: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
    // opacity: 1.0,
  },
  overlay_bar: {
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 10,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    right: 0,
    opacity: 1.0,
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    // borderWidth: 0.5,
    // borderBottomWidth: 0,
  },
  sidebar: {
    width: 60,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',

    position: 'absolute',
    bottom: 70,
    right: 20,
    opacity: 1.0,
    backgroundColor: 'rgba(0, 0,  0, 0.0)',
  },
  title_text: {
    fontFamily: theme.fontFamily,
    fontSize: 16,
    color: 'black',
  },
});

//make this component available to the app
// export default VideoPlayerComp;
export default connect(mapStateToProps, {})(VideoPlayerComp);

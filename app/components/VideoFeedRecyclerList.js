//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GestureRecognizer from 'react-native-swipe-gestures';

import VideoPlayerComp from './VideoPlayerComp';
import HashTag from './HashTag';
import {
  get_video_data,
  post_video_like,
  // post_video_reshare,
} from '../functions/VideoFeedApi';
import {download_and_share_video} from '../functions/ShareAppActions';
import {showLogInAlert} from '../functions/AuthFunctions';

import {ShareFAB} from './BottomFAB';
import {DownloadCircularBar} from './VideoCircularProgressBar';

import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
const ViewTypes = {
  VideoFeedCard: 0,
};

const {width: winWidth, height: winHeight} = Dimensions.get('window');
// create a component

class ShareComp extends Component {
  render() {
    const {isSharing, progress, onClickShare} = this.props;
    return (
      <View style={{position: 'absolute', bottom: 10, left: 10}}>
        {isSharing ? (
          <DownloadCircularBar current={progress} total={1} />
        ) : (
          <ShareFAB onPress={onClickShare} />
        )}
      </View>
    );
  }
}

class VideoFeedRecyclerList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current_index: 0,
      current_post: null,
      isSharing: false,
      progress: 0,
      focused: true,
      volume: 0,
      feed_data: [],
      p: 1,
      user_data: [],

      width: winWidth,
      height: winHeight,
    };
  }
  dataProvider = new DataProvider((r1, r2) => {
    return (
      r1.liked !== r2.liked ||
      r1.likes !== r2.likes ||
      r1.id != r2.id ||
      r1.paused != r2.paused
      //   ||
      //   this.state.user_data[r1.user.id].follow_status !=
      //     this.state.user_data[r2.user.id].follow_status
    );
  });

  _layoutProvider = new LayoutProvider(
    index => {
      return ViewTypes.VideoFeedCard;
    },
    (type, dim) => {
      switch (type) {
        case ViewTypes.VideoFeedCard:
          dim.width = this.state.width;
          dim.height = this.state.height;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    },
  );

  setIndex = next_index => {
    const feed_data = this.state.feed_data.map((item, index) => {
      if (index === next_index) {
        this.setState({current_post: item});
        return Object.assign({}, item, {paused: false});
      } else {
        return Object.assign({}, item, {paused: true});
      }
    });
    if (next_index != -1) {
      this.setState({feed_data: feed_data, current_index: next_index}, () => {
        this._refRecyclerListView
          ? this._refRecyclerListView.scrollToIndex(
              this.state.current_index,
              true,
            )
          : null;
      });
    } else {
      this.setState({feed_data: feed_data});
    }
  };

  goNext = () => {
    const {current_index, feed_data} = this.state;
    const next_index = Math.min(current_index + 1, feed_data.length - 1);
    this.setIndex(next_index);
  };
  goPrev = () => {
    const {current_index, feed_data} = this.state;
    const next_index = Math.max(current_index - 1, 0);
    this.setIndex(next_index);
  };

  onClickUser = user_info => {
    this.props.navigation.navigate('CreatorProfile', {user: user_info.id});
  };

  onClickLike = (id, action) => {
    post_video_like(id, action).then(response => {
      if (response.status) {
        const feed_data = this.state.feed_data.map(item => {
          if (item.id === id) {
            return Object.assign({}, item, {
              liked: response.liked,
              likes: response.likes,
            });
          } else {
            return item;
          }
        });
        this.setState({feed_data: feed_data});
      } else {
        if (response.error === 'LogInError') {
          showLogInAlert();
        }
      }
    });
  };

  onShared = action => {
    this.setState({isSharing: false});
  };

  updateProgess = progress => {
    this.setState({progress: progress});
    // console.warn(progress, 'progress');
  };
  onClickShare = () => {
    const {current_post} = this.state;
    if (current_post) {
      this.setState({isSharing: true});
      download_and_share_video(
        current_post.share_url,
        current_post.title,
        current_post.external_urls,
        this.updateProgess,
        this.onShared,
      );
    }
  };

  getVideoData() {
    get_video_data('category', this.state.category.id).then(response => {
      if (response.status) {
        const data = response.data;
        this.setState({feed_data: data}, () => {
          this.setIndex(0);
        });
      }
    });
  }
  onRefresh = () => {
    this._refRecyclerListView
      ? this._refRecyclerListView.scrollToIndex(0)
      : null;
    this.setState({feed_data: [], p: 1}, () => {
      this.getVideoData();
    });
  };

  componentWillReceiveProps(prevProps) {
    if (this.state.focused) {
      const {isRefresh} = this.props.route.params
        ? this.props.route.params
        : {isRefresh: false};
      if (isRefresh) {
        this.getVideoData();
      }
    }
  }

  componentDidUpdate() {
    const {category} = this.props;
    if (category && this.state.category != category) {
      this.setState({category: category, current_index: 0}, () => {
        this.getVideoData();
      });
    }
  }

  componentDidMount() {
    this.componentDidUpdate();
    this._focused = this.props.navigation.addListener('focus', () => {
      this.setState({focused: true}, () =>
        this.setIndex(this.state.current_index),
      );
      const {setRoute} = this.props.route.params
        ? this.props.route.params
        : {setRoute: null};
      if (setRoute) {
        setRoute('Videos');
      }
    });
    this._unfocused = this.props.navigation.addListener('blur', () => {
      this.setState({focused: false}, () => this.setIndex(-1));
    });
  }

  componentWillUnmount() {
    this._focused();
    this._unfocused();
  }
  _renderItem(type, item, index) {
    // const paused = true;
    return (
      <View
        style={{
          height: this.state.height,
          width: this.state.width,
        }}>
        <VideoPlayerComp
          video_info={item}
          paused={item.paused}
          onEnd={this.goNext}
          height={0.7 * winHeight}
          onClickUser={this.onClickUser}
        />
        <View style={styles.video_title}>
          <View style={{flex: 1}}>
            <Text style={styles.title_text}>{item.title}</Text>
            <View
              style={{
                flexDirection: 'row',
                fontSize: 15,
                lineHeight: 20,
                maxHeight: 20,
                overflow: 'hidden',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              {item.hashtags_data.map(hashtag => {
                return (
                  <HashTag
                    key={hashtag.id}
                    hashtag={hashtag}
                    style={{fontSize: 15}}
                  />
                );
              })}
            </View>
          </View>
          <View
            style={{
              marginBottom: 0,
              flexDirection: 'row',
            }}>
            <TouchableOpacity>
              <MaterialCommunityIcons
                onPress={() =>
                  this.onClickLike(item.id, item.liked ? 'unlike' : 'like')
                }
                name={'thumb-up'}
                size={item.liked ? 30 : 25}
                color={item.liked ? 'lightblue' : 'black'}
                style={{marginHorizontal: 70}}
              />
              <Text style={{textAlign: 'center', color: 'black'}}>
                {item.likes}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    const {feed_data} = this.state;
    return feed_data.length > 0 ? (
      <View
        style={{
          height: this.state.height,
          width: this.state.width,
          backgroundColor: 'white',
        }}>
        <GestureRecognizer
          onSwipeUp={this.goNext}
          onSwipeDown={this.goPrev}
          config={config}
          style={{flex: 1}}>
          <RecyclerListView
            ref={c => {
              this._refRecyclerListView = c;
            }}
            layoutProvider={this._layoutProvider}
            dataProvider={this.dataProvider.cloneWithRows(feed_data)}
            rowRenderer={(type, data, index) =>
              this._renderItem('option', data, index)
            }
            //   scrollThrottle={16}
            scrollViewProps={{
              scrollEnabled: false,
              refreshControl: (
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              ),
            }}
          />
        </GestureRecognizer>
        <ShareComp
          isSharing={this.state.isSharing}
          progress={this.state.progress}
          onClickShare={this.onClickShare}
        />
      </View>
    ) : (
      <View
        style={styles.container}
        onLayout={event => {
          var {x, y, width, height} = event.nativeEvent.layout;
          this.setState({width: width, height: height});
        }}
      />
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  video_title: {
    backgroundColor: 'white',
    flex: 1,
    marginHorizontal: 10,
    // marginBottom: 10,
  },
  title_text: {
    fontFamily: 'serif',
    fontSize: 20,
    lineHeight: 25,
    maxHeight: 110,
    // textAlign: 'justify',
    overflow: 'hidden',
    color: 'black',
  },
  source_text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'lightblue',
  },
});

const mapStateToProps = state => ({
  category: state.CategoryReducer.category,
});

export default connect(mapStateToProps, {})(VideoFeedRecyclerList);

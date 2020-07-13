//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';

import Entypo from 'react-native-vector-icons/Entypo';
import {DeleteIcon} from '../constants/icon';

import * as RootNavigationRef from '../../RootNavigationRef';
import {get_video_data, delete_video} from '../functions/VideoFeedApi';
import * as theme from '../constants/theme';

const {width: winWidth, height: winHeight} = Dimensions.get('window');
const HEIGHT = 200;
const WIDTH = winWidth / 2 - 1;
// create a component

const ViewTypes = {
  AVATAR: 0,
};

let dataProvider = new DataProvider((r1, r2) => {
  return r1.id !== r2.id;
});

class SourceCard extends Component {
  deletePost = video_info => {
    this.props.deletePost && this.props.deletePost(video_info);
  };
  render() {
    const {video_info, isSelf} = this.props;
    return (
      <View
        style={{
          height: HEIGHT - 10,
          width: WIDTH - 10,
          borderRadius: 10,
          alignSelf: 'center',
          alignItems: 'center',
          overflow: 'hidden',

          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,

          elevation: 6,
        }}>
        <ImageBackground
          source={{uri: video_info.thumbnail_image}}
          style={[styles.avtar_image, {height: HEIGHT - 50}]}>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <View
              style={{
                height: 35,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Entypo
                  name="eye"
                  size={25}
                  color="white"
                  style={{width: 30}}
                />
                <Text style={{color: 'white'}}>{video_info.views}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Entypo
                  name="share"
                  size={25}
                  color="white"
                  style={{width: 30, marginLeft: 10}}
                />
                <Text style={{color: 'white'}}>{video_info.shared}</Text>
              </View>
              {isSelf && (
                <DeleteIcon
                  size={35}
                  color="white"
                  style={{
                    marginLeft: 10,
                  }}
                  onPress={() => {
                    this.deletePost(video_info);
                  }}
                />
              )}
            </View>
          </View>
        </ImageBackground>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: 0,
            padding: 5,
            width: '100%',
            height: 50,
            justifyContent: 'center',
          }}>
          <Text
            style={[
              styles.avatar_name,
              {color: 'black', fontSize: 14, lineHeight: 15},
            ]}
            // adjustsFontSizeToFit={true}
            numberOfLines={2}>
            {video_info.title}
          </Text>
        </View>
        {/* </ImageBackground> */}
      </View>
    );
  }
}

class VideoAvatarList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qcat: null,
      qid: null,
      searchText: null,
      feed_data: [],
      isSelf: false,
    };
  }
  _layoutProvider = new LayoutProvider(
    index => {
      return ViewTypes.AVATAR;
    },
    (type, dim) => {
      switch (type) {
        case ViewTypes.AVATAR:
          dim.width = WIDTH;
          dim.height = HEIGHT;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    },
  );

  goToVideoFeed = index => {
    RootNavigationRef.navigate('VideoFeedScreen', {
      feed_data: this.state.feed_data,
      index: index,
    });
  };

  deletePost = video_info => {
    delete_video(video_info.id).then(response => {
      if (response.status) {
        const feed_data = this.state.feed_data.filter(
          item => item.id !== response.id,
        );
        this.setState({feed_data: feed_data});
      }
    });
  };

  render_avatar(type, data, index) {
    return (
      <View
        style={{
          borderRadius: 5,
        }}>
        <TouchableOpacity
          onPress={() => {
            this.goToVideoFeed(index);
          }}>
          <SourceCard
            video_info={data}
            isSelf={this.state.isSelf}
            deletePost={this.deletePost}
          />
        </TouchableOpacity>
      </View>
    );
  }

  getVideoData = async isRefresh => {
    if (!this.state.isProcessing && this.state.next_p !== null) {
      this.setState({isProcessing: true});
      const {qcat, qid, next_p, searchText} = this.state;
      const query = searchText !== null ? searchText : qid;
      await get_video_data(qcat, query, next_p).then(response => {
        this.setState({isProcessing: false});
        if (response.status) {
          const {data, next_p} = response;
          const feed_data = isRefresh
            ? data
            : [...this.state.feed_data, ...data];
          this.setState({
            feed_data: feed_data,
            next_p: next_p,
          });
        }
      });
      return true;
    }
    return false;
  };

  onRefresh = () => {
    this._refRecyclerListView
      ? this._refRecyclerListView.scrollToIndex(0)
      : null;
    this.setState({next_p: 1}, () => {
      this.getVideoData(true).then(() => this.setState({refreshing: false}));
    });
  };

  componentDidUpdate = () => {
    const {qcat, qid, searchText} = this.props;
    if (this.state.qcat != qcat || this.state.qid != qid) {
      let isSelf = false;
      if (qcat === 'user_post' && qid === this.props.user_id) {
        isSelf = true;
      }
      this.setState({qcat: qcat, qid: qid, isSelf: isSelf}, () => {
        this.onRefresh();
      });
    } else if (
      searchText !== null &&
      this.state.searchText != this.props.searchText
    ) {
      this.setState({searchText: searchText}, () => {
        this.onRefresh();
      });
    }
  };
  componentDidMount() {
    this.componentDidUpdate();
  }
  render() {
    let {label, onScroll} = this.props;
    const {isSelf, feed_data} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {label && <Text style={styles.userLabel}>{label}</Text>}
        {feed_data.length > 0 ? (
          <View style={{flex: 1}}>
            <RecyclerListView
              ref={c => {
                this._refRecyclerListView = c;
              }}
              onScroll={onScroll ? onScroll : null}
              scrollThrottle={150}
              onEndReached={this.getVideoData}
              onEndReachedThreshold={2 * HEIGHT}
              layoutProvider={this._layoutProvider}
              dataProvider={dataProvider.cloneWithRows(feed_data)}
              rowRenderer={(type, data, index) =>
                this.render_avatar('option', data, index)
              }
              scrollThrottle={16}
              scrollViewProps={{
                refreshControl: (
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />
                ),
              }}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  avtar_image: {
    // height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  avatar_name: {
    fontFamily: theme.fontFamily,
    fontWeight: 'bold',
  },
  userLabel: {
    fontSize: 18,
    fontFamily: theme.fontFamily,
    fontStyle: 'italic',
    paddingHorizontal: 5,
    alignSelf: 'stretch',
    // textAlign: 'center',
  },
});

//make this component available to the app
import {connect} from 'react-redux';

const mapStateToProps = state => ({
  user_id: state.AuthReducer.user_id,
});

export default connect(mapStateToProps, {})(VideoAvatarList);
// export default VideoAvatarList;

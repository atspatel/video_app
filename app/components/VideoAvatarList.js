//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';

import * as RootNavigationRef from '../../RootNavigationRef';
import {get_video_data} from '../functions/VideoFeedApi';
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
  render() {
    const {video_info} = this.props;
    return (
      <View
        style={{
          height: HEIGHT - 15,
          width: WIDTH - 10,
          //   backgroundColor: '#DDD',
          borderRadius: 10,
          alignSelf: 'center',
          alignItems: 'center',
          overflow: 'hidden',

          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.5,
          shadowRadius: 4.65,

          elevation: 7,
        }}>
        <ImageBackground
          source={{uri: video_info.thumbnail_image}}
          style={styles.avtar_image}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 1.0)',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'black',
                width: '100%',
              }}>
              <Text
                style={[
                  styles.avatar_name,
                  {textAlign: 'center', color: 'black'},
                ]}
                // adjustsFontSizeToFit={true}
                numberOfLines={3}>
                {video_info.title}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

class TopicAvatarList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qcat: null,
      qid: null,
      searchText: null,
      feed_data: [],
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
          <SourceCard video_info={data} />
        </TouchableOpacity>
      </View>
    );
  }

  getVideoData = async isRefresh => {
    if (!this.state.isProcessing && this.state.next_p !== null) {
      this.setState({isProcessing: true});
      const {qcat, qid, next_p, searchText} = this.state;
      const query = searchText && searchText.length > 0 ? searchText : '';
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
      this.setState({qcat: qcat, qid: qid}, () => {
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
    const {feed_data} = this.state;
    return (
      <View style={{flex: 1}}>
        <Text style={styles.userLabel}>{label}</Text>
        {feed_data.length > 0 ? (
          <View style={{flex: 1}}>
            <RecyclerListView
              ref={c => {
                this._refRecyclerListView = c;
              }}
              onScroll={onScroll ? onScroll : null}
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
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  avatar_name: {
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  userLabel: {
    fontSize: 18,
    fontFamily: 'serif',
    paddingHorizontal: 5,
    alignSelf: 'stretch',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
});

//make this component available to the app
export default TopicAvatarList;

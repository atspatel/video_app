//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import * as RootNavigationRef from '../../RootNavigationRef';

import {get_video_data} from '../functions/VideoFeedApi';
import * as theme from '../constants/theme';

// create a component
const WIDTH = 100;
const HEIGHT = 200;

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
          height: HEIGHT - 10,
          width: WIDTH - 10,
          //   backgroundColor: '#DDD',
          borderRadius: 10,
          alignSelf: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}>
        <ImageBackground
          source={{uri: video_info.thumbnail_image}}
          style={styles.avtar_image}></ImageBackground>
      </View>
    );
  }
}

class VideoHorizontalList extends Component {
  state = {};
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
      feed_data: this.props.feed_data,
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
  render() {
    const {feed_data} = this.props;
    return (
      <View style={{flex: 1}}>
        <RecyclerListView
          layoutProvider={this._layoutProvider}
          dataProvider={dataProvider.cloneWithRows(feed_data)}
          rowRenderer={(type, data, index) =>
            this.render_avatar('option', data, index)
          }
          scrollThrottle={16}
          isHorizontal={true}
        />
      </View>
    );
  }
}

class UserVideoBottomFeed extends Component {
  state = {
    isLoading: false,
    user_id: null,
    next_p: 1,
    feed_data: [],
  };

  get_user_feed = () => {
    if (this.state.user_id && !this.state.isLoading) {
      this.setState({isLoading: true});
      get_video_data('user_post', this.state.user_id, this.state.next_p).then(
        response => {
          this.setState({isLoading: false});
          if (response.status) {
            const {data, next_p} = response;
            const feed_data = [...this.state.feed_data, ...data];
            this.setState({
              feed_data: feed_data,
              next_p: next_p,
            });
          }
        },
      );
    }
  };

  componentDidUpdate() {
    const {user_id} = this.props;
    if (this.state.user_id != user_id) {
      this.setState({user_id: user_id}, () => this.get_user_feed());
    }
  }
  componentDidMount() {
    this.componentDidUpdate();
  }
  render() {
    if (this.state.feed_data.length > 0) {
      return (
        <View style={{height: HEIGHT}}>
          <VideoHorizontalList feed_data={this.state.feed_data} />
        </View>
      );
    } else {
      return <View style={{height: HEIGHT}}></View>;
    }
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  avtar_image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  avatar_name: {
    fontFamily: theme.fontFamily,
    fontWeight: 'bold',
  },
});

//make this component available to the app
export default UserVideoBottomFeed;

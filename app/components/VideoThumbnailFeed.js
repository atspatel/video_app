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
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import Entypo from 'react-native-vector-icons/Entypo';

import ProfilePic from './ProfilePic';
import * as RootNavigation from '../../RootNavigationRef';
import {get_video_data} from '../functions/VideoFeedApi';

const HEIGHT = 160;
// create a component

const ViewTypes = {
  AVATAR: 0,
};

let dataProvider = new DataProvider((r1, r2) => {
  return r1.id !== r2.id;
});

let {width} = Dimensions.get('window');

class UserInfo extends Component {
  onClickUser = id => {
    RootNavigation.navigate('CreatorProfile', {user: id});
  };
  render() {
    const {user_info} = this.props;
    return (
      <TouchableOpacity onPress={() => this.onClickUser(user_info.id)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontFamily: 'serif', marginRight: 5}}>
            {user_info.name}
          </Text>
          <ProfilePic
            profile_pic={user_info.profile_pic}
            user_name={user_info.name}
            size={45}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

class VideoThumbnail extends Component {
  render() {
    const {video_info} = this.props;
    return (
      <View style={{height: HEIGHT - 10}}>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Image
              style={styles.image_thumbnail}
              source={{uri: video_info.thumbnail_image}}
            />
            <View style={{flex: 1, marginLeft: 10, justifyContent: 'center'}}>
              <Text style={styles.title_text}>{video_info.title}</Text>
            </View>

            {/* <View style={{width: 20, backgroundColor: '#DDD'}} /> */}
          </View>
          <View
            style={{
              height: 45,
              //   backgroundColor: '#DDD',xw
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Entypo
                name="eye"
                size={25}
                color="white"
                style={{alignSelf: 'center', width: 30}}
              />
              <Text style={{color: 'white'}}>{video_info.views}</Text>
              <Entypo
                name="share"
                size={25}
                color="white"
                style={{alignSelf: 'center', width: 30, marginLeft: 10}}
              />
              <Text style={{color: 'white'}}>{video_info.shared}</Text>
            </View>
            <UserInfo user_info={video_info.user} />
          </View>
        </View>
      </View>
    );
  }
}

class VideoThumbnailFeed extends Component {
  state = {
    qcat: null,
    qid: null,
    data_list: null,
  };

  get_video_data() {
    get_video_data(this.state.qcat, this.state.qid).then(response => {
      if (response.status) {
        this.setState({data_list: response.data});
      }
    });
  }
  componentDidUpdate() {
    const {qcat, qid} = this.props;
    if ((qcat && this.state.qcat != qcat) || (qid && this.state.qid != qid)) {
      this.setState({qcat: qcat, qid: qid}, () => {
        this.get_video_data();
      });
    }
  }
  componentDidMount() {
    this.componentDidUpdate();
  }
  _layoutProvider = new LayoutProvider(
    index => {
      return ViewTypes.AVATAR;
    },
    (type, dim) => {
      switch (type) {
        case ViewTypes.AVATAR:
          dim.width = width;
          dim.height = HEIGHT;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    },
  );

  render_avatar(type, data, index) {
    return (
      <View
        style={{
          backgroundColor: '#DDD',
          borderRadius: 10,
          marginHorizontal: 5,
          overflow: 'hidden',
        }}>
        <TouchableOpacity
          onPress={() => {
            RootNavigation.navigate('VideoFeedScreen', {
              feed_data: this.state.data_list,
              index: index,
            });
          }}>
          <VideoThumbnail video_info={data} />
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    const {onScroll} = this.props;
    let {data_list} = this.state;
    // data_list = data_list ? data_list : [];
    return data_list ? (
      data_list.length > 0 ? (
        <View style={styles.container}>
          <RecyclerListView
            style={{marginTop: 10}}
            layoutProvider={this._layoutProvider}
            dataProvider={dataProvider.cloneWithRows(data_list)}
            rowRenderer={(type, data, index) =>
              this.render_avatar('option', data, index)
            }
            onScroll={onScroll ? onScroll : null}
            scrollThrottle={16}
          />
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No Posts</Text>
        </View>
      )
    ) : null;
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 500,
    backgroundColor: 'white',
  },
  title_text: {
    color: 'black',
    fontFamily: 'serif',
    fontSize: 15,
    lineHeight: 20,
    maxHeight: 105,
    overflow: 'hidden',
  },
  image_stretch: {
    width: 45,
    height: 45,
    resizeMode: 'cover',
    borderRadius: 23,
    borderWidth: 2,
    borderColor: 'white',
  },
  image_thumbnail: {
    width: 150,
    height: 150,
    resizeMode: 'stretch',
  },
});

//make this component available to the app
export default VideoThumbnailFeed;

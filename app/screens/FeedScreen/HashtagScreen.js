//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import VideoThumbnailFeed from '../../components/VideoThumbnailFeed';
import FollowButton from '../../components/FollowButton';

import {get_follow, post_follow} from '../../functions/CreatorApi';
import * as theme from '../../constants/theme';

// create a component
class HashtagScreen extends Component {
  state = {
    hashtag: null,
    isFollowed: null,
  };

  onFollow = action => {
    if (this.state.hashtag) {
      post_follow('hashtag', action, this.state.hashtag.id).then(response => {
        console.warn(response, 'post');
        if (response.status) {
          this.setState({isFollowed: response.is_followed});
        }
      });
    }
  };

  getFollow = () => {
    if (this.state.hashtag) {
      get_follow('hashtag', this.state.hashtag.id).then(response => {
        console.warn(response, 'get');
        if (response.status) {
          this.setState({isFollowed: response.is_followed});
        }
      });
    }
  };

  componentDidUpdate() {
    const {hashtag} = this.props.route
      ? this.props.route.params
      : {hashtag: null};
    if (this.state.hashtag != hashtag) {
      this.setState({hashtag: hashtag}, () => this.getFollow());
    }
  }
  componentDidMount() {
    this.componentDidUpdate();
  }
  render() {
    const {hashtag, isFollowed} = this.state;
    return hashtag ? (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 20,
          }}>
          <View
            style={{
              width: 65,
              height: 65,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 33,
              backgroundColor: '#DDD',
            }}>
            <MaterialCommunityIcons name="pound" color={'black'} size={35} />
          </View>
          <View style={{flex: 1, marginLeft: 20}}>
            <Text style={styles.title}>{hashtag.tag}</Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View style={{flex: 1}}>
                <FollowButton
                  isFollowed={isFollowed}
                  onFollow={this.onFollow}
                />
              </View>
              {hashtag.views ? (
                <Text style={{flex: 1}}>{hashtag.views} Views</Text>
              ) : (
                <Text></Text>
              )}
            </View>
          </View>
        </View>
        <View style={{flex: 1}}>
          <VideoThumbnailFeed qcat={'hashtag'} qid={this.state.hashtag.id} />
        </View>
      </View>
    ) : null;
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontFamily: theme.fontFamily,
    fontSize: 20,
    marginVertical: 5,
  },
});

//make this component available to the app
export default HashtagScreen;

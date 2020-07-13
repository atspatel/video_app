//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import VideoThumbnailFeed from '../../components/VideoThumbnailFeed';
import FollowButton from '../../components/FollowButton';
import * as theme from '../../constants/theme';
// create a component
class TopicScreen extends Component {
  state = {
    topic: null,
  };

  componentDidMount() {
    const {topic} = this.props.route ? this.props.route.params : {topic: null};
    if (this.state.topic != topic) {
      this.setState({topic: topic});
    }
  }
  render() {
    const {topic} = this.state;
    return topic ? (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
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
            <MaterialCommunityIcons
              name="library-books"
              color={'black'}
              size={35}
            />
          </View>
          <View style={{flex: 1, marginLeft: 20}}>
            <Text style={styles.title}>{topic.name}</Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View style={{flex: 1}}>
                <FollowButton />
              </View>
              {topic.views ? (
                <Text style={{flex: 1}}>{topic.views} Views</Text>
              ) : (
                <Text></Text>
              )}
            </View>
          </View>
        </View>
        <View style={{flex: 1}}>
          <VideoThumbnailFeed qcat={'topic'} qid={this.state.topic.id} />
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
export default TopicScreen;

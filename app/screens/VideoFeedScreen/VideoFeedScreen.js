//import liraries
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import VideoDataFeed from '../../components/VideoDataFeed';

// create a component
class VideoFeedScreen extends Component {
  render() {
    const {feed_data, index} = this.props.route.params;
    return <VideoDataFeed feed_data={feed_data} index={index} />;
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
});

//make this component available to the app
export default VideoFeedScreen;

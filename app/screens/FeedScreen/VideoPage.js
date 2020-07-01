//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import VideoDataFeed from '../../components/VideoDataFeed';
import {get_single_video_data} from '../../functions/VideoFeedApi';

// create a component
class VideoPage extends Component {
  state = {
    video_id: null,
    feed_data: null,
    index: 0,
  };

  getVideoData = () => {
    if (this.state.video_id) {
      get_single_video_data(this.state.video_id).then(response => {
        if (response.status) {
          this.setState({feed_data: response.data, index: 0});
        }
      });
    }
  };
  componentDidUpdate() {
    const {video_id} = this.props.route.params;
    if (this.state.video_id !== video_id) {
      this.setState({video_id: video_id}, () => this.getVideoData());
    }
  }
  componentDidMount() {
    this.componentDidUpdate();
  }
  render() {
    const {feed_data, index} = this.state;
    if (feed_data && feed_data.length > 0) {
      return <VideoDataFeed feed_data={feed_data} index={index} />;
    } else {
      return null;
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
});

//make this component available to the app
export default VideoPage;

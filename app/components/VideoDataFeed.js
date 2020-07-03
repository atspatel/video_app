//import liraries
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';

import VideoFeed from './VideoFeed';
import {showLogInAlert} from '../functions/AuthFunctions';
import {post_video_like} from '../functions/VideoFeedApi';

// create a component
class VideoDataFeed extends Component {
  state = {
    current_index: 0,
    feed_data: [],
  };

  setIndex = next_index => {
    const feed_data = this.state.feed_data.map((item, index) => {
      if (index === next_index) {
        return Object.assign({}, item, {paused: false});
      } else {
        return Object.assign({}, item, {paused: true});
      }
    });
    if (next_index !== -1) {
      this.setState({feed_data: feed_data, current_index: next_index});
    } else {
      this.setState({feed_data: feed_data});
    }
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

  componentDidUpdate(prevProps) {
    const {feed_data, index} = this.props;
    const {feed_data: prev_feed_data, index: prev_index} = prevProps;
    if (
      (prev_feed_data && prev_feed_data !== feed_data) ||
      (prev_index && prev_index !== index)
    ) {
      this.setState({feed_data: feed_data, current_index: index}, () =>
        this.setIndex(this.state.current_index),
      );
    }
  }
  componentDidMount() {
    const {feed_data, index} = this.props;
    if (
      this.state.feed_data !== feed_data ||
      this.state.current_index !== index
    ) {
      this.setState({feed_data: feed_data, current_index: index}, () =>
        this.setIndex(this.state.current_index),
      );
    }
  }
  render() {
    const {feed_data, current_index} = this.state;
    return feed_data.length > 0 ? (
      <VideoFeed
        feed_data={feed_data}
        index={current_index}
        setIndex={this.setIndex}
        onClickLike={this.onClickLike}
      />
    ) : null;
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
export default VideoDataFeed;

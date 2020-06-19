//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import VideoThumbnailFeed from '../../components/VideoThumbnailFeed';

// create a component
class UserTopics extends Component {
  state = {
    qcat: 'user_topic',
    qid: null,
  };
  componentDidUpdate() {
    const {qcat, qid} = this.props.route
      ? this.props.route.params
      : {qcat: null, qid: null};
    if ((qcat && this.state.qcat != qcat) || (qid && this.state.qid != qid)) {
      this.setState({qcat: qcat, qid: qid});
    }
  }
  render() {
    const {qcat, qid} = this.state;
    return qid ? (
      <View style={styles.container}>
        <VideoThumbnailFeed qcat={qcat} qid={qid} />
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
});

//make this component available to the app
export default UserTopics;

//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import * as theme from '../constants/theme';

class FollowButton extends Component {
  state = {
    isFollowed: false,
  };
  componentDidUpdate() {
    const {isFollowed} = this.props;
    if (this.state.isFollowed !== isFollowed) {
      this.setState({isFollowed});
    }
  }
  componentDidMount() {
    this.componentDidUpdate();
  }
  onFollow = action => {
    this.setState({isFollowed: action === 'follow' ? true : false});
    this.props.onFollow ? this.props.onFollow(action) : null;
  };
  render() {
    const {isFollowed, isSelf, onFollow, style} = this.props;
    return (
      <View style={style}>
        {isSelf ? null : this.state.isFollowed ? (
          <TouchableOpacity onPress={() => this.onFollow('unfollow')}>
            <View
              style={[styles.follow_button, {backgroundColor: '#EEE'}, style]}>
              <Text style={[styles.follow_button_text, {color: '#999'}]}>
                Following
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => this.onFollow('follow')}>
            <View style={[styles.follow_button, style]}>
              <Text style={styles.follow_button_text}>Follow</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  follow_button: {
    width: 100,
    backgroundColor: '#B00',
    alignItems: 'center',
    borderRadius: 10,
    padding: 3,
  },
  follow_button_text: {
    color: 'white',
    fontFamily: theme.fontFamily,
  },
});

//make this component available to the app
export default FollowButton;

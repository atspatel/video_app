//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

class FollowButton extends Component {
  state = {
    isFollowed: false,
  };
  componentDidMount() {
    const {isFollowed} = this.props;
    this.setState({isFollowed});
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
    fontFamily: 'serif',
  },
});

//make this component available to the app
export default FollowButton;

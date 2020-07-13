//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {get_follow, post_follow} from '../functions/CreatorApi';
import * as theme from '../constants/theme';
class FollowButton extends Component {
  state = {
    qcat: null,
    qid: null,
    isFollowed: false,
    isProcessing: false,
  };

  post_follow = action => {
    const {qcat, qid} = this.state;
    let {follow_mapping} = this.props;
    post_follow(qcat, action, qid).then(response => {
      if (response.status) {
        this.props.updateFollowMapping(qid, response.is_followed);
      }
    });
  };

  get_follow = () => {
    const {qcat, qid} = this.state;
    let {follow_mapping} = this.props;
    if (qcat === 'user' && follow_mapping[qid] !== undefined) {
      this.setState({
        isFollowed: follow_mapping[qid],
      });
    } else {
      if (!this.state.isProcessing) {
        this.setState({isProcessing: true}, () => {
          get_follow(qcat, qid).then(response => {
            this.setState({isProcessing: false});
            if (response.status) {
              this.props.updateFollowMapping(qid, response.is_followed);
            }
          });
        });
      }
    }
  };

  componentDidUpdate() {
    const {qcat, qid} = this.props;
    const {follow_mapping} = this.props;
    if (
      this.state.qcat !== qcat ||
      this.state.qid !== qid ||
      this.state.follow_mapping !== follow_mapping
    ) {
      this.setState(
        {qcat: qcat, qid: qid, follow_mapping: follow_mapping},
        () => this.get_follow(),
      );
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
    const {isSelf, style} = this.props;
    return (
      <View style={style}>
        {isSelf ? null : this.state.isFollowed ? (
          <TouchableOpacity onPress={() => this.post_follow('unfollow')}>
            <View
              style={[styles.follow_button, {backgroundColor: '#EEE'}, style]}>
              <Text style={[styles.follow_button_text, {color: '#999'}]}>
                Following
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => this.post_follow('follow')}>
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
import {connect} from 'react-redux';
import {updateFollowMapping} from '../functions/CreatorApi';
const mapStateToProps = state => ({
  follow_mapping: state.FollowMappingReducer.user_follow_mapping,
});

export default connect(mapStateToProps, {updateFollowMapping})(FollowButton);

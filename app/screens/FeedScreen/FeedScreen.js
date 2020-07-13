//import liraries
import React, {Component} from 'react';
import {View, StyleSheet, Dimensions, RefreshControl} from 'react-native';
import {connect} from 'react-redux';

import {get_video_data, post_video_like} from '../../functions/VideoFeedApi';
import {setCategory} from '../../functions/CategoryFunctions';
import {showLogInAlert} from '../../functions/AuthFunctions';
import VideoFeed from '../../components/VideoFeed';
import {ConnectedCategoryModal} from '../../components/CategoryModal';
import * as theme from '../../constants/theme';

class FeedScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current_index: 0,
      feed_data: [],
      next_p: 1,

      isProcessing: false,
      refreshing: false,

      focused: true,
      isVisible: false,
    };
  }

  onSelectCategory = category => {
    this.closeModal();
    this.props.setCategory(category);
  };

  onToggleModal = () => {
    this.setState({isVisible: !this.state.isVisible});
  };

  closeModal = () => {
    this.setState({isVisible: false});
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
    console.warn('here,,,,');
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
  getVideoData = async isRefresh => {
    if (!this.state.isProcessing && this.state.next_p !== null) {
      this.setState({isProcessing: true});
      await get_video_data(
        'category',
        this.state.category.id,
        this.state.next_p,
      ).then(response => {
        this.setState({isProcessing: false, refreshing: false});
        if (response.status) {
          const {data, next_p} = response;
          const feed_data = isRefresh
            ? data
            : [...this.state.feed_data, ...data];
          this.setState(
            {
              feed_data: feed_data,
              next_p: next_p,
            },
            () => {
              this.setIndex(0);
            },
          );
        }
      });
      return true;
    }
    return false;
  };

  onRefresh = () => {
    this.setState({next_p: 1, isProcessing: false, refreshing: true}, () => {
      if (this.state.current_index !== 0) {
        this.setIndex(0);
      }
      this.getVideoData(true).then(() => {
        this.setState({refreshing: false});
      });
    });
  };

  UNSAFE_componentWillReceiveProps(prevProps) {
    if (this.state.focused) {
      const {isRefresh} = this.props.route.params
        ? this.props.route.params
        : {isRefresh: false};
      if (isRefresh) {
        this.onRefresh();
      }
    }
  }

  componentDidUpdate() {
    const {category} = this.props;
    if (category && this.state.category != category) {
      this.setState({category: category, current_index: 0}, () => {
        this.onRefresh();
      });
    }
  }

  componentDidMount() {
    this.componentDidUpdate();
    this._focused = this.props.navigation.addListener('focus', () => {
      this.setState({focused: true}, () =>
        this.setIndex(this.state.current_index),
      );
      // const {setRoute} = this.props.route.params
      //   ? this.props.route.params
      //   : {setRoute: null};
      // if (setRoute) {
      //   setRoute('Videos');
      // }
    });
    this._unfocused = this.props.navigation.addListener('blur', () => {
      this.setState({focused: false}, () => this.setIndex(-1));
    });
  }

  componentWillUnmount() {
    this._focused();
    this._unfocused();
  }
  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    const {feed_data, current_index} = this.state;
    return (
      <View style={{flex: 1}}>
        <ConnectedCategoryModal
          isVisible={this.state.isVisible}
          closeModal={this.closeModal.bind(this)}
          onSelectCategory={this.onSelectCategory.bind(this)}
          position={'flex-end'}
        />
        <VideoFeed
          feed_data={feed_data}
          index={current_index}
          setIndex={this.setIndex}
          onClickLike={this.onClickLike}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          getVideoData={this.getVideoData}
          onSwipeRight={this.onToggleModal}
        />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  video_title: {
    backgroundColor: 'black',
    flex: 1,
    paddingHorizontal: 10,
    // marginBottom: 10,
  },
  title_text: {
    marginTop: 5,
    fontFamily: theme.fontFamily,
    fontSize: 18,
    lineHeight: 20,
    maxHeight: 65,
    // textAlign: 'justify',
    overflow: 'hidden',
    color: 'white',
  },
  source_text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'lightblue',
  },
});

const mapStateToProps = state => ({
  category: state.CategoryReducer.category,
});

export default connect(mapStateToProps, {setCategory})(FeedScreen);

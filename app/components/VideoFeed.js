//import liraries
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import GestureRecognizer from 'react-native-swipe-gestures';

import VideoPlayerComp from './VideoPlayerComp';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import * as theme from '../constants/theme';

const ViewTypes = {
  VideoFeedCard: 0,
};
// create a component

class VideoFeed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current_index: 0,
      feed_data: [],
      refreshing: false,

      width: null,
      height: null,
    };
  }
  dataProvider = new DataProvider((r1, r2) => {
    return (
      r1.liked !== r2.liked ||
      r1.likes !== r2.likes ||
      r1.id != r2.id ||
      r1.paused != r2.paused
    );
  });

  _layoutProvider = new LayoutProvider(
    index => {
      return ViewTypes.VideoFeedCard;
    },
    (type, dim) => {
      switch (type) {
        case ViewTypes.VideoFeedCard:
          dim.width = this.state.width;
          dim.height = this.state.height;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    },
  );
  updateStateData = (feed_data, index) => {
    if (index !== -1) {
      this.setState({feed_data: feed_data, current_index: index}, () => {
        this._refRecyclerListView &&
          this._refRecyclerListView.scrollToIndex(
            this.state.current_index,
            true,
          );
      });
    } else {
      this.setState({feed_data: feed_data});
    }
  };

  goNext = () => {
    const {current_index, feed_data} = this.state;
    const next_index = Math.min(current_index + 1, feed_data.length - 1);
    this.props.setIndex(next_index);
  };

  goPrev = () => {
    const {current_index} = this.state;
    const next_index = Math.max(current_index - 1, 0);
    this.props.setIndex(next_index);
  };

  onSwipeRight = () => {
    this.props.onSwipeRight && this.props.onSwipeRight();
  };

  componentDidUpdate() {
    const {feed_data, index} = this.props;
    if (
      this.state.feed_data !== feed_data ||
      this.state.current_index !== index
    ) {
      this.updateStateData(feed_data, index);
    }
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  _renderItem(type, item, index) {
    // const paused = true;
    return (
      <View
        style={{
          height: this.state.height,
          width: this.state.width,
        }}>
        <VideoPlayerComp
          video_info={item}
          paused={item.paused}
          onEnd={this.goNext}
          height={1.0 * this.state.height}
          onClickLike={this.props.onClickLike}
        />
      </View>
    );
  }
  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 50,
    };
    const {feed_data} = this.state;
    const {refreshing, onRefresh, getVideoData, onClickLike} = this.props;
    return feed_data.length > 0 && this.state.height ? (
      <View
        style={{
          height: this.state.height,
          width: this.state.width,
          backgroundColor: 'white',
        }}>
        <GestureRecognizer
          onSwipeUp={this.goNext}
          onSwipeDown={this.goPrev}
          onSwipeRight={this.onSwipeRight}
          config={config}
          style={{flex: 1}}>
          <RecyclerListView
            ref={c => {
              this._refRecyclerListView = c;
            }}
            initialRenderIndex={this.state.current_index}
            layoutProvider={this._layoutProvider}
            dataProvider={this.dataProvider.cloneWithRows(feed_data)}
            rowRenderer={(type, data, index) =>
              this._renderItem('option', data, index)
            }
            //   scrollThrottle={16}
            onEndReached={getVideoData ? getVideoData : null}
            onEndReachedThreshold={5 * this.state.height}
            scrollViewProps={{
              scrollEnabled: false,
              refreshControl: onRefresh ? (
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              ) : null,
            }}
          />
        </GestureRecognizer>
      </View>
    ) : (
      <View
        style={styles.container}
        onLayout={event => {
          var {x, y, width, height} = event.nativeEvent.layout;
          this.setState({width: width, height: height});
        }}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          scrollEnabled={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ) : null
          }>
          <GestureRecognizer
            onSwipeRight={this.onSwipeRight}
            config={config}
            style={{flex: 1, backgroundColor: 'white'}}></GestureRecognizer>
        </ScrollView>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default connect(mapStateToProps, {})(VideoFeed);

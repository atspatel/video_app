//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';

import * as RootNavigationRef from '../../RootNavigationRef';
import FollowButton from './FollowButton';
import {get_topic_data} from '../functions/CategoryFunctions';
const HEIGHT = 160;
const WIDTH = 130;
// create a component

const ViewTypes = {
  AVATAR: 0,
};

let dataProvider = new DataProvider((r1, r2) => {
  return r1.is_followed !== r2.is_followed;
});

class SourceCard extends Component {
  render() {
    const {source_info, onPressFollow} = this.props;
    return (
      <View
        style={{
          height: HEIGHT - 10,
          width: WIDTH - 10,
          backgroundColor: '#DDD',
          borderRadius: 10,
          alignItems: 'center',
          overflow: 'hidden',
        }}>
        <ImageBackground
          source={{uri: source_info.logo_url}}
          style={styles.avtar_image}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderRadius: 10,
                width: '100%',
              }}>
              <Text
                style={[
                  styles.avatar_name,
                  {textAlign: 'center', color: 'white'},
                ]}
                numberOfLines={2}
                adjustsFontSizeToFit={true}>
                {source_info.name}
              </Text>
              {/* <Text style={styles.follow_count}>{source_info.followers}</Text> */}
              <FollowButton
                isFollowed={source_info.is_followed}
                onFollow={action => onPressFollow(action, source_info)}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

class TopicAvatarList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qcat: null,
      qid: null,
      searchText: null,
      data_list: [],
      isExpanded: false,
    };
  }
  _layoutProvider = new LayoutProvider(
    index => {
      return ViewTypes.AVATAR;
    },
    (type, dim) => {
      switch (type) {
        case ViewTypes.AVATAR:
          dim.width = WIDTH;
          dim.height = HEIGHT;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    },
  );

  goToTopicFeed = topic => {
    RootNavigationRef.navigate('TopicScreen', {topic: topic});
  };

  onFollow = (action, source_info) => {
    //TODO:: Call Follow api here
    const is_followed = action === 'follow' ? true : false;
    const data_list = this.state.data_list.map(item => {
      if (item.id === source_info.id) {
        // this.change_select_list(id, item.is_followed)
        return Object.assign({}, item, {is_followed: is_followed});
      }
      return item;
    });
    this.setState({data_list: data_list});
  };
  render_avatar(type, data) {
    return (
      <View
        style={{
          borderRadius: 5,
        }}>
        <TouchableOpacity
          onPress={() => {
            this.goToTopicFeed(data);
          }}>
          <SourceCard source_info={data} onPressFollow={this.onFollow} />
        </TouchableOpacity>
      </View>
    );
  }
  toggleUserSection = () => {
    this.setState({isExpanded: !this.state.isExpanded});
  };

  get_topic_data = () => {
    get_topic_data(this.state.qcat, this.state.qid, this.state.searchText).then(
      response => {
        this.setState({
          data_list: [...this.state.data_list, ...response.topic_data],
        });
      },
    );
  };
  onRefresh = () => {
    this._refRecyclerListView
      ? this._refRecyclerListView.scrollToIndex(0)
      : null;
    this.setState({data_list: [], p: 1}, () => {
      this.get_topic_data();
    });
  };
  componentDidUpdate = () => {
    const {qcat, qid, searchText} = this.props;
    if (this.state.qcat != qcat || this.state.qid != qid) {
      this.setState({qcat: qcat, qid: qid}, () => {
        this.onRefresh();
      });
    } else if (
      searchText !== null &&
      this.state.searchText != this.props.searchText
    ) {
      this.setState({searchText: searchText}, () => {
        this.onRefresh();
      });
    }
  };
  componentDidMount() {
    this.componentDidUpdate();
  }
  render() {
    let {qcat, qid, label, onScroll} = this.props;
    const {data_list} = this.state;
    return (
      <View style={{flex: 1}}>
        <Text style={styles.userLabel}>{label}</Text>
        {data_list.length > 0 ? (
          <View style={{flex: 1}}>
            <RecyclerListView
              ref={c => {
                this._refRecyclerListView = c;
              }}
              onScroll={onScroll ? onScroll : null}
              style={{margin: 10}}
              layoutProvider={this._layoutProvider}
              dataProvider={dataProvider.cloneWithRows(data_list)}
              rowRenderer={(type, data) => this.render_avatar('option', data)}
              scrollThrottle={16}
              scrollViewProps={{
                refreshControl: (
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />
                ),
              }}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  avtar_image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  avatar_name: {
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  userLabel: {
    fontSize: 18,
    fontFamily: 'serif',
    paddingHorizontal: 5,
  },
});

//make this component available to the app
export default TopicAvatarList;

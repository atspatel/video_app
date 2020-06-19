//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import FollowButton from './FollowButton';
import ProfilePic from './ProfilePic';
import {get_creator_data, post_follow} from '../functions/CreatorApi';
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
          padding: 5,
          alignItems: 'center',
        }}>
        <ProfilePic
          profile_pic={source_info.profile_pic}
          user_name={source_info.name}
          size={70}
        />
        {/* <Image
          source={{uri: source_info.profile_pic}}
          style={styles.avtar_image}
        /> */}
        <Text style={styles.avatar_name} numberOfLines={1}>
          {source_info.name ? source_info.name.substring(0, 12) : null}
        </Text>
        <Text style={styles.follow_count}>
          {source_info.followers} followers
        </Text>
        <FollowButton
          isFollowed={source_info.follow_status == 'follow' ? true : false}
          isSelf={source_info.follow_status == 'self' ? true : false}
          onFollow={action => onPressFollow(action, source_info)}
        />
      </View>
    );
  }
}

class UserAvatarList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data_list: [],
      isExpanded: false,
      searchText: null,
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

  onFollow = (action, source_info) => {
    //TODO:: Call Follow api here
    post_follow('creator', action, source_info.id).then(response => {
      if (response.status) {
        const data_list = this.state.data_list.map(item => {
          if (item.id === response.id) {
            return Object.assign({}, item, {is_followed: response.is_followed});
          }
          return item;
        });
        this.setState({data_list: data_list});
      }
    });
  };
  toggleUserSection = () => {
    this.setState({isExpanded: !this.state.isExpanded});
  };
  get_creator_data = () => {
    get_creator_data(this.state.searchText, true).then(response => {
      this.setState({
        data_list: [...this.state.data_list, ...response.data],
      });
    });
  };

  onRefresh = () => {
    this._refRecyclerListView && this.state.data_list.length > 0
      ? this._refRecyclerListView.scrollToIndex(0)
      : null;
    this.setState({data_list: [], p: 1}, () => {
      this.get_creator_data();
    });
  };
  componentDidUpdate() {
    const {searchText} = this.props;
    if (searchText !== null && this.state.searchText != this.props.searchText) {
      this.setState({searchText: searchText}, () => {
        this.onRefresh();
      });
    }
  }
  componentDidMount() {
    this.get_creator_data();
  }
  render_avatar(type, data) {
    return (
      <View
        style={{
          borderRadius: 5,
        }}>
        <TouchableOpacity
          onPress={() => {
            return this.props.onClick ? this.props.onClick(data.id) : true;
          }}>
          <SourceCard source_info={data} onPressFollow={this.onFollow} />
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    let {label, searchText, onClick} = this.props;
    const {data_list} = this.state;
    return data_list.length > 0 ? (
      <View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={this.toggleUserSection}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              marginHorizontal: 2,
              borderRadius: 10,
            }}>
            <Text style={styles.userLabel}>{label}</Text>
            <MaterialCommunityIcons
              style={{width: 50, alignItems: 'center'}}
              name={'arrow-right-circle'}
              size={30}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: HEIGHT + 10,
          }}>
          <RecyclerListView
            ref={c => {
              this._refRecyclerListView = c;
            }}
            style={{margin: 10}}
            layoutProvider={this._layoutProvider}
            dataProvider={dataProvider.cloneWithRows(data_list)}
            rowRenderer={(type, data) => this.render_avatar('option', data)}
            scrollThrottle={16}
            isHorizontal={true}
          />
        </View>
      </View>
    ) : null;
  }
}

// define your styles
const styles = StyleSheet.create({
  avtar_image: {
    height: 70,
    width: 70,
    resizeMode: 'cover',
    borderRadius: 40,
  },
  avatar_name: {
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  userLabel: {
    fontSize: 18,
    fontFamily: 'serif',
    padding: 5,
  },
});

//make this component available to the app
export default UserAvatarList;

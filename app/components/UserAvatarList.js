//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import FollowButton from './FollowButtonTwo';
import ProfilePic from './ProfilePic';
import {get_creator_data, post_follow} from '../functions/CreatorApi';
import * as theme from '../constants/theme';
const HEIGHT = 200;
const WIDTH = 130;
// create a component

const ViewTypes = {
  AVATAR: 0,
};

let dataProvider = new DataProvider((r1, r2) => {
  return r1.is_followed !== r2.is_followed;
});

export class SourceCard extends Component {
  render() {
    const {source_info, showFollow} = this.props;
    return (
      <View
        style={{
          height: HEIGHT - 10,
          width: WIDTH - 10,
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 5,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 5,
          // borderWidth: 0.5,

          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,

          elevation: 6,
        }}>
        <ProfilePic
          profile_pic={source_info.profile_pic}
          user_name={source_info.name}
          size={110}
        />
        <Text style={styles.avatar_name} numberOfLines={1}>
          {source_info.name ? source_info.name.substring(0, 12) : null}
        </Text>
        <Text style={{fontSize: 12}}>{source_info.followers} followers</Text>
        {showFollow ? (
          <FollowButton
            qid={source_info.id}
            qcat={'user'}
            isSelf={source_info.follow_status == 'self' ? true : false}
          />
        ) : null}
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
          <SourceCard source_info={data} showFollow={true} />
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    let {label, searchText, onClick} = this.props;
    const {data_list} = this.state;
    return data_list.length > 0 ? (
      <View>
        <View
          style={{
            height: HEIGHT + 10,
          }}>
          <RecyclerListView
            ref={c => {
              this._refRecyclerListView = c;
            }}
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
    fontFamily: theme.fontFamily,
    fontWeight: 'bold',
    color: 'black',
  },
  userLabel: {
    fontSize: 18,
    fontFamily: theme.fontFamily,
    padding: 5,
  },
});

//make this component available to the app
export default UserAvatarList;

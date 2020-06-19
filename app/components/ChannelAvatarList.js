//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import FollowButton from './FollowButton';
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
        <Image
          source={{uri: source_info.logo_url}}
          style={styles.avtar_image}
        />
        <Text style={styles.avatar_name}>{source_info.name}</Text>
        <Text style={styles.follow_count}>{source_info.followers}</Text>
        <FollowButton
          isFollowed={source_info.is_followed}
          onFollow={action => onPressFollow(action, source_info)}
        />
      </View>
    );
  }
}

class ChannelAvatarList extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
            return this.props.onClick ? this.props.onClick(data.id) : true;
          }}>
          <SourceCard source_info={data} onPressFollow={this.onFollow} />
        </TouchableOpacity>
      </View>
    );
  }
  toggleUserSection = () => {
    this.setState({isExpanded: !this.state.isExpanded});
  };
  componentDidMount() {
    const data_list = this.props.data_list;
    this.setState({data_list: data_list});
  }
  render() {
    let {label, onClick} = this.props;
    const {data_list} = this.state;
    return (
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={this.toggleUserSection}
            style={{
              flex: 1,
              flexDirection: 'row',
              backgroundColor: '#DDD',
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
            style={{margin: 10}}
            layoutProvider={this._layoutProvider}
            dataProvider={dataProvider.cloneWithRows(data_list)}
            rowRenderer={(type, data) => this.render_avatar('option', data)}
            scrollThrottle={16}
            isHorizontal={true}
          />
        </View>
      </View>
    );
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
export default ChannelAvatarList;

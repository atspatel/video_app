//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, Linking, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import {Chip} from 'react-native-paper';
import Collapsible from 'react-native-collapsible';

import FollowButton from '../../components//FollowButton';
import ProfilePic from '../../components/ProfilePic';
import UserVideoTabBar from '../../navigations/UserVideoTabBar';

import {getUserData} from '../../functions/CreatorApi';
import {LogOutfunc} from '../../functions/AuthFunctions';

// create a component

const logo_name = {
  facebook: {name: 'facebook-square', color: 'blue'},
  twitter: {name: 'twitter', color: 'lightblue'},
  youtube: {name: 'youtube', color: 'red'},
  website: {name: 'earth', color: 'black'},
};

class UserInfo extends Component {
  get_label(name) {
    const a = name.split(' ').slice(0, 2);
    return a.length == 2 ? `${a[0][0]}${a[1][0]}` : a[0] ? a[0][0] : null;
  }
  render() {
    const {
      isSelf,
      user_data,
      send_height,
      isCollapsed,
      openCollapsible,
      GoToChoicePage,
      GoToSettingPage,
    } = this.props;
    return (
      <View
        style={{flexDirection: 'row'}}
        onLayout={event => {
          var {x, y, width, height} = event.nativeEvent.layout;
          send_height(height);
        }}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
          }}>
          <ProfilePic
            profile_pic={user_data.profile_pic}
            user_name={user_data.name}
            isSingleImage={true}
          />
          <TouchableOpacity
            disabled={!isCollapsed}
            onPress={openCollapsible}
            activeOpacity={0.2}>
            <View style={{marginHorizontal: 10, flex: 1}}>
              <Text style={styles.user_text}>{user_data.name}</Text>
              <Text
                style={[styles.user_text, {fontSize: 12, fontStyle: 'italic'}]}>
                @{user_data.username}
              </Text>
              <Text style={[styles.user_text, {fontSize: 12}]}>
                {user_data.bio}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {isCollapsed ? (
          <View style={{flexDirection: 'row', marginRight: 10}}>
            <MaterialCommunityIcons
              onPress={openCollapsible}
              name="chevron-down-circle"
              size={30}
              color="black"
              style={{paddingLeft: 10, alignSelf: 'center'}}
            />
          </View>
        ) : isSelf ? (
          <View style={{flexDirection: 'row', marginRight: 10}}>
            <MaterialCommunityIcons
              onPress={() => {
                GoToSettingPage(user_data.id);
              }}
              name="account-edit"
              size={30}
              color="black"
              style={{paddingLeft: 10, alignSelf: 'center'}}
            />
            <MaterialCommunityIcons
              onPress={() => {
                GoToChoicePage(user_data.id);
              }}
              name="table-settings"
              size={30}
              color="black"
              style={{paddingLeft: 10, alignSelf: 'center'}}
            />
          </View>
        ) : (
          <View style={{flexDirection: 'row', marginRight: 10}}>
            <MaterialCommunityIcons
              // onPress={() => {
              //   this.props.navigation.navigate('CategoriesChoicesPage');
              // }}
              name="dots-vertical"
              size={30}
              color="black"
              style={{paddingLeft: 10, alignSelf: 'center'}}
            />
          </View>
        )}
      </View>
    );
  }
}

class FollowInfo extends Component {
  render() {
    const {user_data} = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          // width: '70%',
          // alignSelf: 'flex-end',
        }}>
        <Text style={styles.follow_text}>
          <Text style={{fontSize: 18}}>{user_data.followers}</Text>
          <Text> Followers</Text>
        </Text>
        <TouchableOpacity
          onPress={() => {
            console.warn('show followings');
          }}>
          <Text style={styles.follow_text}>
            <Text style={{fontSize: 18}}>{user_data.followings || 0}</Text>
            <Text> Following</Text>
          </Text>
        </TouchableOpacity>
        <FollowButton
          isFollowed={user_data.follow_status == 'follow' ? true : false}
          isSelf={user_data.follow_status == 'self' ? true : false}
          onFollow={action => console.warn(action, user_data.id)}
        />
      </View>
    );
  }
}

class SMInfo extends Component {
  open_url = (app_url, web_url) => {
    Linking.canOpenURL(app_url).then(supported => {
      if (supported) {
        return Linking.openURL(app_url);
      } else {
        return Linking.openURL(web_url);
      }
    });
  };

  open_channel(sm, page_id, url) {
    let app_url;
    switch (sm) {
      case 'facebook':
        app_url = `fb://page/${page_id}`;
        return this.open_url(app_url, url);
      case 'youtube':
        return Linking.openURL(url);
      case 'twitter':
        return Linking.openURL(url);
      case 'website':
        return Linking.openURL(url);
      default:
        return null;
    }
  }
  renderSingleSM(sm, sm_info, icon_only) {
    return (
      <TouchableOpacity
        onPress={() => this.open_channel(sm, sm_info.page_id, sm_info.url)}
        style={{marginTop: 5, width: '50%', height: 30}}>
        <View style={{flexDirection: 'row'}}>
          <AntDesign
            name={logo_name[sm].name}
            size={25}
            color={logo_name[sm].color}
            style={{alignSelf: 'center'}}
          />
          {icon_only ? null : <Text>{sm_info.name}</Text>}
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    const {user_data} = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '70%',
          alignSelf: 'flex-end',
        }}>
        {user_data.facebook
          ? this.renderSingleSM('facebook', user_data.facebook, false)
          : null}
        {user_data.youtube
          ? this.renderSingleSM('youtube', user_data.youtube, false)
          : null}
        {user_data.twitter
          ? this.renderSingleSM('twitter', user_data.twitter, false)
          : null}
        {user_data.website
          ? this.renderSingleSM('website', user_data.website, false)
          : null}
      </View>
    );
  }
}

class ContentInfo extends Component {
  render() {
    const {user_data} = this.props;
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 2,
          }}>
          <Entypo
            name="language"
            size={25}
            color="black"
            style={{alignSelf: 'center', width: 30}}
          />
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              flex: 1,
            }}>
            {user_data.languages_data.slice(0, 3).map(item => {
              return (
                <Chip key={item.id} style={styles.chip}>
                  <Text style={{fontFamily: 'serif'}}>{item.tag}</Text>
                </Chip>
              );
            })}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 2,
          }}>
          <FontAwesome5
            name="award"
            size={25}
            color="black"
            style={{alignSelf: 'center', width: 30}}
          />
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              flex: 1,
            }}>
            {user_data.categories_data.slice(0, 4).map(item => {
              return (
                <Chip key={item.id} style={styles.chip}>
                  <Text style={{fontFamily: 'serif'}}>{item.tag}</Text>
                </Chip>
              );
            })}
          </View>
        </View>
      </View>
    );
  }
}

class ProfileInfo extends Component {
  constructor(props) {
    super(props);
  }
  getMinHeight = height => {
    // if (this.props.setHMin) {
    //   this.props.setHMin(height);
    // }
  };
  getMaxHeight = height => {
    // if (this.props.setHMax) {
    //   this.props.setHMax(height);
    // }
  };
  render() {
    const {
      isSelf,
      user_data,
      isCollapsed,
      openCollapsible,
      GoToChoicePage,
      GoToSettingPage,
    } = this.props;
    return (
      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: 1,
          paddingHorizontal: 10,
        }}
        onLayout={event => {
          var {x, y, width, height} = event.nativeEvent.layout;
          this.getMaxHeight(height);
        }}>
        <UserInfo
          isSelf={isSelf}
          user_data={user_data}
          send_height={this.getMinHeight}
          isCollapsed={isCollapsed}
          openCollapsible={openCollapsible}
          GoToSettingPage={GoToSettingPage}
          GoToChoicePage={GoToChoicePage}
        />
        <Collapsible collapsed={isCollapsed}>
          <SMInfo user_data={user_data} />
          <ContentInfo user_data={user_data} />
          <FollowInfo user_data={user_data} />
        </Collapsible>
      </View>
    );
  }
}
class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      user_data: null,
      isCollapsed: false,
      focused: true,
    };
  }
  // setHMin = height => {
  //   this.setState({hMin: height});
  // };
  // setHMax = height => {
  //   this.setState({hMax: height});
  // };
  onCliclLogOut = () => {
    this.props.LogOutfunc();
    this.props.navigation.navigate('ProfileNavigation');
  };
  onUpdateInfo = () => {
    console.warn('here.......');
    this.get_user_data();
  };

  GoToChoicePage = user_id => {
    this.props.navigation.navigate('ChoiceScreen', {
      user_id: user_id,
    });
  };
  GoToSettingPage = user_id => {
    this.props.navigation.navigate('SettingScreen', {
      user_id: user_id,
      user_data: this.state.user_data,
      onCallUpdate: this.onUpdateInfo,
    });
  };
  onScroll = (rawEvent, offsetX, offsetY) => {
    if (!this.state.isCollapsed && offsetY !== 0) {
      this.setState({isCollapsed: true});
    }
  };
  openCollapsible = () => {
    this.setState({isCollapsed: false});
  };

  get_user_data = () => {
    let user_id = this.state.user;
    if (user_id === 'self') {
      user_id = this.props.user_id;
    }
    getUserData(user_id).then(response => {
      this.setState({user_data: response.data[0]});
    });
  };
  componentDidUpdate() {
    const {user} = this.props.route ? this.props.route.params : {user: 'self'};
    if (this.state.user != user) {
      this.setState({user: user}, () => {
        this.get_user_data();
      });
    }
  }

  componentDidMount() {
    const {user} = this.props.route
      ? this.props.route.params
      : {user: this.props.user_id};
    if (this.state.user != user) {
      this.setState({user: user}, () => {
        this.get_user_data();
      });
    }
  }

  render() {
    const {user, user_data, isCollapsed, focused} = this.state;
    const isSelf = user === 'self' ? true : false;
    if (focused) {
      return user_data ? (
        <View style={styles.container}>
          <ProfileInfo
            isSelf={isSelf}
            user_data={user_data}
            isCollapsed={isCollapsed}
            openCollapsible={this.openCollapsible}
            GoToChoicePage={isSelf ? this.GoToChoicePage : null}
            GoToSettingPage={isSelf ? this.GoToSettingPage : null}
          />
          <UserVideoTabBar
            onScroll={this.onScroll}
            user_id={user === 'self' ? this.props.user_id : user}
          />
        </View>
      ) : null;
    } else {
      return null;
    }
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'stretch',
    backgroundColor: 'white',
    // paddingHorizontal: 15,
    paddingTop: 10,
  },
  user_text: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'serif',
  },

  follow_text: {
    fontFamily: 'serif',
    fontSize: 14,
  },
  chip: {
    margin: 1,
  },
});

import {connect} from 'react-redux';

const mapStateToProps = state => ({
  user_id: state.AuthReducer.user_id,
});

export default connect(mapStateToProps, {LogOutfunc})(ProfilePage);
// export default ProfilePage;

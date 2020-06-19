//import liraries
import React, {Component} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import UserPosts from '../screens/ProfileScreen/UserPosts';
import UserTopics from '../screens/ProfileScreen/UserTopics';

const UserTab = createMaterialTopTabNavigator();
class UserVideoTabBar extends Component {
  render() {
    const {onScroll, user_id} = this.props;
    return (
      <UserTab.Navigator
        initialRouteName={'Posts'}
        tabBarOptions={{
          // activeTintColor: 'black',
          inactiveTintColor: 'gray',
          showLabel: true,
          style: {backgroundColor: '#DDD'},
          upperCaseLabel: false,
          tabStyle: {
            height: 30,
            paddingTop: 0,
            justifyContent: 'center',
            alignItems: 'center',
          },
          labelStyle: {
            height: 30,
            marginTop: 0,
            fontSize: 15,
            fontFamily: 'serif',
            textAlign: 'center',
            textTransform: 'none',
          },

          indicatorStyle: {
            height: 2,
            backgroundColor: 'white',
          },
        }}>
        <UserTab.Screen
          name="Posts"
          component={UserPosts}
          initialParams={{
            onScroll: onScroll,
            qcat: 'user_post',
            qid: user_id ? user_id : null,
          }}
        />
        {/* <UserTab.Screen
          name="Channels"
          component={UserTopics}
          initialParams={{onScroll: onScroll, qcat: 'user'}}
        /> */}

        {/* <UserTab.Screen
          name="Re-posts"
          component={VideoThumbnailFeed}
          initialParams={{onScroll: onScroll, qcat: 'user_repost'}}
        /> */}
      </UserTab.Navigator>
    );
  }
}

//make this component available to the app
export default UserVideoTabBar;

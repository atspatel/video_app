import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {connect} from 'react-redux';

import LogIn from '../screens/LogInScreens/LogIn';
import NameScreen from '../screens/LogInScreens/NameScreen';
import ProfilePage from '../screens/ProfileScreen/ProfilePage';
import SettingScreen from '../screens/ProfileScreen/SettingScreen';
import ChoiceScreen from '../screens/ProfileScreen/ChoiceScreen';
import FollowingScreen from '../screens/ProfileScreen/FollowingScreen';

const InProfileStack = createStackNavigator();
class InProfileNavigation extends Component {
  render() {
    return (
      <InProfileStack.Navigator
        // initialRouteName="Profile"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}>
        <InProfileStack.Screen
          name="Profile"
          component={ProfilePage}
          initialParams={{user: 'self'}}
        />
        <InProfileStack.Screen
          name="SettingScreen"
          component={SettingScreen}
          initialParams={{}}
        />
        <InProfileStack.Screen
          name="ChoiceScreen"
          component={ChoiceScreen}
          initialParams={{}}
        />
        <InProfileStack.Screen
          name="FollowingScreen"
          component={FollowingScreen}
          initialParams={{}}
        />
      </InProfileStack.Navigator>
    );
  }
}

const ProfileStack = createStackNavigator();
class ProfileNavigation extends Component {
  render() {
    const isLoggedIn = this.props.Token ? true : false;
    const isUserName = this.props.user_name ? true : false;
    return (
      <ProfileStack.Navigator
        // initialRouteName="Profile"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}>
        {isLoggedIn ? (
          isUserName ? (
            <ProfileStack.Screen
              name="InProfileNavigation"
              component={InProfileNavigation}
              initialParams={{user: 'self'}}
            />
          ) : (
            <ProfileStack.Screen
              name="NameScreen"
              component={NameScreen}
              initialParams={{user: 'self'}}
            />
          )
        ) : (
          <ProfileStack.Screen name="LogIn" component={LogIn} />
        )}
      </ProfileStack.Navigator>
    );
  }
}

const mapStateToProps = state => ({
  Token: state.AuthReducer.Token,
  user_name: state.AuthReducer.user_name,
});

export default connect(mapStateToProps, {})(ProfileNavigation);
// export default ProfileNavigation;

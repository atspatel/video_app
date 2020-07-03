import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Keyboard} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import HomeTab from '../components/HomeTab';
import DiscoverPage from '../components/DiscoverPage';
import ProfileNavigation from './ProfileNavigation';
import {CreateFAB} from '../components/BottomFAB';

const labelIconMap = {
  HomeTab: 'home',
  Search: 'search',
  Notification: 'bell',
  ProfileNavigation: 'user',
};

function CreateScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Create!</Text>
    </View>
  );
}

class TabIcon extends Component {
  render() {
    const {name, isFocused} = this.props;
    let icon_name = labelIconMap[name];
    if (name === 'HomeTab' && isFocused) {
      icon_name = 'angle-double-up';
    }
    return (
      <FontAwesome5
        name={icon_name}
        size={isFocused ? 35 : 25}
        color={isFocused ? 'white' : '#999'}
      />
    );
  }
}

export class MyTabBar extends Component {
  state = {
    isVisible: true,
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        this.setState({isVisible: false});
      },
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        this.setState({isVisible: true});
      },
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  render() {
    const {isVisible} = this.state;
    const {state: navState, descriptors, navigation} = this.props;
    return isVisible ? (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          height: 40,
          backgroundColor: 'black',
          borderTopColor: 'white',
          borderTopWidth: 1,
        }}>
        {navState.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = navState.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              data: {isRefresh: isFocused},
            });
            let params = {};
            if (route.name === 'ProfileNavigation') {
              params = {user: 'self'};
            }
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, params);
            } else if (route.name === 'HomeTab') {
              navigation.navigate(route.name, {
                screen: 'Videos',
                params: {isRefresh: isFocused},
              });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
          if (label == 'Create') {
            return (
              <View
                key={index}
                style={{alignItems: 'center', marginBottom: 0, flex: 1}}>
                <CreateFAB />
              </View>
            );
          } else {
            return (
              <TouchableOpacity
                key={index}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}>
                <TabIcon isFocused={isFocused} name={label} />
              </TouchableOpacity>
            );
          }
        })}
      </View>
    ) : null;
  }
}

const Tab = createMaterialTopTabNavigator();

export default class BottomNavigation extends Component {
  render() {
    return (
      <Tab.Navigator
        tabBarPosition="bottom"
        swipeEnabled={false}
        tabBarOptions={{
          keyboardHidesTabBar: true,
        }}
        swipeEnabled={false}
        tabBar={props => <MyTabBar {...props} />}>
        <Tab.Screen name="HomeTab" component={HomeTab} />
        <Tab.Screen name="Search" component={DiscoverPage} />
        <Tab.Screen name="ProfileNavigation" component={ProfileNavigation} />
        <Tab.Screen name="Create" component={CreateScreen} />
      </Tab.Navigator>
    );
  }
}

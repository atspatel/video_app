import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import TopicFeed from '../components/TopicFeed';
// import VideoFeed from '../components/VideoFeed';
import VideoFeedRecyclerList from '../components/VideoFeedRecyclerList';
import TopicTitle from '../components/HeaderTitle';

const TopicStack = createStackNavigator();
class TopicStackNavigator extends Component {
  render() {
    const {setRoute} = this.props.route.params;
    return (
      <TopicStack.Navigator
        initialRouteName="TopicFeed"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}>
        <TopicStack.Screen
          name="TopicFeed"
          component={TopicFeed}
          initialParams={{
            setRoute: setRoute,
          }}
        />
        <TopicStack.Screen
          name="TopicVideoFeed"
          component={VideoFeedRecyclerList}
          options={({route}) => ({title: route.params.topic.name})}
        />
      </TopicStack.Navigator>
    );
  }
}

const HomeTab = createMaterialTopTabNavigator();

export class HomeNavigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active_route: 'Videos',
    };
  }

  componentDidMount() {
    this._focused = this.props.navigation.addListener('tabPress', payload => {
      const {isRefresh} = payload ? payload.data : {isRefresh: false};
      this.props.navigation.navigate(this.state.active_route, {
        isRefresh: isRefresh,
      });
    });
  }

  set_active_route = route_name => {
    this.setState({active_route: route_name});
  };
  componentWillUnmount() {
    this._focused();
  }
  render() {
    return (
      <HomeTab.Navigator
        initialRouteName={'Videos'}
        tabBarOptions={{
          inactiveTintColor: 'gray',
          showLabel: false,
          style: {height: 5, backgroundColor: 'black'},
          indicatorStyle: {
            height: 2,
            backgroundColor: 'white',
          },
        }}>
        <HomeTab.Screen
          name="Videos"
          component={VideoFeedRecyclerList}
          initialParams={{
            setRoute: this.set_active_route,
          }}
        />
        {/* <HomeTab.Screen
          name="Topics"
          component={TopicStackNavigator}
          initialParams={{
            setRoute: this.set_active_route,
          }}
        /> */}
      </HomeTab.Navigator>
    );
  }
}

export default HomeNavigation;

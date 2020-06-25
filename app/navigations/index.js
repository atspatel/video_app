import React, {Component} from 'react';
import {AppState} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import BottomNavigation from './BottomNavigation';
import CreateVideoNavigation from '../navigations/CreateVideoNavigation';
import ProfilePage from '../screens/ProfileScreen/ProfilePage';
import VideoFeedScreen from '../screens/VideoFeedScreen/VideoFeedScreen';
import Home from '../components/Home';
import {HashtagScreen, TopicScreen} from '../screens/FeedScreen';

const Stack = createStackNavigator();

class MainAppNavigation extends Component {
  state = {
    passed: false,
  };

  componentWillUnmount() {
    this.props.clearFollowMapping();
  }

  componentDidMount = () => {
    setTimeout(() => this.setState({passed: true}), 2000);
  };
  render() {
    return (
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}>
        {this.state.passed ? null : (
          <Stack.Screen name="HomeScreen" component={Home} />
        )}
        <Stack.Screen
          name="BottomNavigation"
          component={BottomNavigation}
          initialParams={{}}
        />
        <Stack.Screen
          name="HashtagScreen"
          component={HashtagScreen}
          initialParams={{}}
        />
        <Stack.Screen
          name="TopicScreen"
          component={TopicScreen}
          initialParams={{}}
        />
        <Stack.Screen name="CreateScreen" component={CreateVideoNavigation} />
        <Stack.Screen name="CreatorProfile" component={ProfilePage} />
        <Stack.Screen
          name="VideoFeedScreen"
          component={VideoFeedScreen}
          initialParams={{}}
        />
      </Stack.Navigator>
    );
  }
}

import {connect} from 'react-redux';
import {clearFollowMapping} from '../functions/CreatorApi';

export default connect(null, {clearFollowMapping})(MainAppNavigation);

// export default MainAppNavigation;

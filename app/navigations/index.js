import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import BottomNavigation from './BottomNavigation';
import VideoRecorder from '../components/VideoRecorder';
import ProfilePage from '../screens/ProfileScreen/ProfilePage';
import VideoFeedScreen from '../screens/VideoFeedScreen/VideoFeedScreen';
import Home from '../components/Home';
import {HashtagScreen, TopicScreen} from '../screens/FeedScreen';

const Stack = createStackNavigator();

class MainAppNavigation extends Component {
  state = {
    passed: false,
  };

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
          // headerTitleAlign: 'center',
          // headerTitleStyle: {
          //   fontFamily: 'serif',
          //   height: 30,
          //   textAlign: 'center',
          // },
          // headerStyle: {
          //   height: 40,
          // },
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
        <Stack.Screen name="CreateScreen" component={VideoRecorder} />
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

export default MainAppNavigation;

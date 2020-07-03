import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  HashtagScreen,
  TopicScreen,
  CategoryScreen,
} from '../screens/FeedScreen';

const FeedStack = createStackNavigator();
class FeedStackNavigator extends Component {
  render() {
    return (
      <FeedStack.Navigator
        initialRouteName="HashtagScreen"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}>
        <FeedStack.Screen
          name="HashtagScreen"
          component={HashtagScreen}
          initialParams={{}}
        />
        <FeedStack.Screen
          name="TopicScreen"
          component={TopicScreen}
          initialParams={{}}
        />
        <FeedStack.Screen
          name="CategoryScreen"
          component={CategoryScreen}
          initialParams={{}}
        />
      </FeedStack.Navigator>
    );
  }
}

export default FeedStackNavigator;

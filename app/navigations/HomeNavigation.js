import React, {Component} from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FeedScreen from '../screens/FeedScreen/FeedScreen';

// import {createStackNavigator} from '@react-navigation/stack';
// import TopicFeed from '../components/TopicFeed';

// const TopicStack = createStackNavigator();
// class TopicStackNavigator extends Component {
//   render() {
//     return (
//       <TopicStack.Navigator
//         initialRouteName="TopicFeed"
//         screenOptions={{
//           headerShown: false,
//           gestureEnabled: false,
//         }}>
//         <TopicStack.Screen
//           name="TopicFeed"
//           component={TopicFeed}
//           initialParams={{
//             setRoute: setRoute,
//           }}
//         />
//         <TopicStack.Screen
//           name="TopicVideoFeed"
//           component={FeedScreen}
//           options={({route}) => ({title: route.params.topic.name})}
//         />
//       </TopicStack.Navigator>
//     );
//   }
// }

const HomeTab = createMaterialTopTabNavigator();

export class HomeNavigation extends Component {
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
          component={FeedScreen}
          initialParams={{}}
        />
        {/* <HomeTab.Screen
          name="Topics"
          component={TopicStackNavigator}
          initialParams={{}}
        /> */}
      </HomeTab.Navigator>
    );
  }
}

export default HomeNavigation;

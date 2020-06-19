//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FeedScreen from './FeedScreen';

// create a component
class CategoryScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>CategoryScreen</Text>
        <FeedScreen />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default CategoryScreen;

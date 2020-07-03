//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import HomeNavigation from '../navigations/HomeNavigation';

// create a component
class HomeTab extends Component {
  render() {
    return (
      <View style={styles.container}>
        <HomeNavigation navigation={this.props.navigation} />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

//make this component available to the app
export default HomeTab;

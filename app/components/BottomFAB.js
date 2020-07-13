//import liraries
import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import * as RootNavigation from '../../RootNavigationRef';
import * as theme from '../constants/theme';

// create a component
export class CreateFAB extends Component {
  onPressFAB() {
    RootNavigation.navigate('CreateScreen');
  }
  render() {
    return (
      <FAB
        style={[
          styles.fabButton,
          {width: 60, height: 60, borderRadius: 30, borderWidth: 3},
        ]}
        icon={props => {
          return (
            <MaterialCommunityIcons
              name="plus"
              size={40}
              color={'black'}
              style={{
                margin: -10,
                alignSelf: 'center',
                alignItems: 'center',
              }}
            />
          );
        }}
        onPress={this.onPressFAB.bind(this)}
      />
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
  fabButton: {
    backgroundColor: theme.logoColor,
    // width: 130,
    height: 40,
    borderWidth: 2,
    borderColor: 'white',
    padding: 0,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {DownloadIcon} from '../constants/icon';

import * as theme from '../constants/theme';

// create a component
class VideoCircularProgressBar extends Component {
  render() {
    const {size, current, total, style} = this.props;
    return (
      <AnimatedCircularProgress
        size={size ? size : 50}
        width={3}
        fill={current ? (1 - current / total) * 100 : 100}
        tintColor={theme.logoColor}
        style={style ? style : {}}
      />
    );
  }
}

export class DownloadCircularBar extends Component {
  render() {
    const {current, total, size} = this.props;
    let a_size = size ? size : 50;
    return (
      <AnimatedCircularProgress
        size={a_size}
        width={3}
        fill={current ? (1 - current / total) * 100 : 100}
        tintColor={theme.logoColor}
        backgroundColor="#999">
        {fill => (
          <View
            style={{
              height: a_size,
              width: a_size,
              backgroundColor: '#DDD',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <DownloadIcon
              size={a_size - 10}
              color="black"
              style={{
                backgroundColor: '#DDD',
                padding: -10,
                margin: -10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          </View>
        )}
      </AnimatedCircularProgress>
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
export default VideoCircularProgressBar;

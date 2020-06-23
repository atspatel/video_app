//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {DownloadIcon} from '../constants/icon';

// create a component
class VideoCircularProgressBar extends Component {
  render() {
    const {current, total} = this.props;
    return (
      <AnimatedCircularProgress
        size={50}
        width={3}
        fill={current ? (1 - current / total) * 100 : 100}
        tintColor="black"
        backgroundColor="#FFFFFF">
        {fill => (
          <View
            style={{
              backgroundColor: 'white',
              height: 50,
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              adjustsFontSizeToFit={true}
              style={{
                fontSize: 20,
                color: 'black',
                fontWeight: 'bold',
              }}>
              {parseInt(total - current)}
            </Text>
          </View>
        )}
      </AnimatedCircularProgress>
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
        tintColor="black"
        backgroundColor="#DDD">
        {fill => (
          <DownloadIcon
            size={a_size - 10}
            color="black"
            style={{
              backgroundColor: 'white',
              padding: -10,
              margin: -10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          // </View>
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
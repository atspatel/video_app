//import liraries
import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';

// create a component
const logo_url = 'https://storage.googleapis.com/kp_videos/kp_logo.png';
class KeypointsLogo extends Component {
  render() {
    return (
      <View style={{padding: 10, backgroundColor: 'white', borderRadius: 15}}>
        <Image
          style={styles.tinyLogo}
          source={{
            uri: logo_url,
          }}
        />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  tinyLogo: {
    height: 70,
    width: 70,
    resizeMode: 'contain',
    backgroundColor: 'white',
  },
});

//make this component available to the app
export default KeypointsLogo;

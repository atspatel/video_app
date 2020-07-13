//import liraries
import React, {Component} from 'react';
import {StyleSheet, Image} from 'react-native';
import {SingleImage} from 'react-native-zoom-lightbox';
import {Avatar} from 'react-native-paper';

export class ProfilePic extends Component {
  get_label(name) {
    const a = name.split(' ').slice(0, 2);
    return a.length == 2 ? `${a[0][0]}${a[1][0]}` : a[0] ? a[0][0] : null;
  }
  render() {
    const {profile_pic, user_name, size, isSingleImage, round} = this.props;
    const img_size = size ? size : 65;
    const radius = round ? img_size : 10;
    return profile_pic ? (
      isSingleImage ? (
        <SingleImage
          uri={profile_pic}
          style={{
            resizeMode: 'cover',
            // borderWidth: 1,
            // borderColor: 'black',
            width: img_size,
            height: img_size,
            borderRadius: radius,
          }}
        />
      ) : (
        <Image
          source={{uri: profile_pic}}
          style={[
            styles.image_stretch,
            {height: img_size, borderRadius: radius},
            {width: img_size},
          ]}
        />
      )
    ) : (
      <Avatar.Text size={size} label={this.get_label(user_name)} />
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
  image_stretch: {
    resizeMode: 'stretch',
  },
});

//make this component available to the app
export default ProfilePic;

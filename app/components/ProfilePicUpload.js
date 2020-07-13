//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Avatar, FAB} from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';

import * as theme from '../constants/theme';
// create a component
class ProfilePicUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onPressAddProfilePic() {
    ImagePicker.showImagePicker(
      {noData: true, mediaType: 'photo'},
      response => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          this.props.onChangeProfilePic(response);
        }
      },
    );
  }

  onPressDeleteProfilePic() {
    this.props.onPressDeleteProfilePic();
  }
  _render_avatar() {
    if (this.props.avatar.type == 'label') {
      return (
        <Avatar.Text
          size={150}
          label={this.props.avatar.label}
          style={{backgroundColor: '#ffb7d1'}}
        />
      );
    } else if (this.props.avatar.type == 'image') {
      return (
        <Avatar.Image
          size={150}
          source={{uri: this.props.avatar.image_uri.uri}}
          style={{backgroundColor: 'white'}}
        />
      );
    }
  }

  _render_delete() {
    if (this.props.avatar.type == 'image') {
      return (
        <FAB
          icon="delete"
          style={styles.fab_delete}
          small
          onPress={() => this.onPressDeleteProfilePic()}
        />
      );
    }
  }

  _render_plus() {
    return (
      <FAB
        icon="plus"
        style={styles.fab_plus}
        small
        onPress={() => this.onPressAddProfilePic()}
      />
    );
  }

  render() {
    const {onChangeProfilePic, onPressDeleteProfilePic, avatar} = this.props;
    return (
      <View style={styles.container}>
        <View>
          {this._render_avatar()}
          {this._render_delete()}
          {this._render_plus()}
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab_plus: {
    backgroundColor: 'black',
    position: 'absolute',
    margin: 0,
    right: 0,
    bottom: 0,
  },
  fab_delete: {
    backgroundColor: 'black',
    position: 'absolute',
    margin: 0,
    left: 0,
    bottom: 0,
  },
});

//make this component available to the app
export default ProfilePicUpload;

//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';

export class ShareIcon extends Component {
  render() {
    const {size, color, style} = this.props;
    return (
      <MaterialCommunityIcons
        name="share"
        size={size ? size : 35}
        color={color ? color : 'white'}
        style={[{padding: 5, minWidth: 35}, style]}
      />
    );
  }
}

export class PlayIcon extends Component {
  render() {
    const {size, color, style} = this.props;
    return (
      <MaterialCommunityIcons
        name="play"
        size={size ? size : 100}
        color={color ? color : 'white'}
        style={[{padding: 5, minWidth: 35}, style]}
      />
    );
  }
}

export class DownloadIcon extends Component {
  render() {
    const {size, color, style} = this.props;
    return (
      <MaterialCommunityIcons
        name="download"
        size={size ? size : 25}
        color={color ? color : 'black'}
        style={[{padding: 5, minWidth: 35}, style]}
      />
    );
  }
}

export class DeleteIcon extends Component {
  onPress = () => {
    if (this.props.onPress) {
      Alert.alert(
        'Do you want to delete this post?',
        '',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => this.props.onPress(),
          },
        ],
        {cancelable: false},
      );
    }
  };
  render() {
    const {size, color, style} = this.props;
    return (
      <MaterialCommunityIcons
        onPress={this.onPress}
        name="delete-circle"
        size={size ? size : 25}
        color={color ? color : 'black'}
        style={[{padding: 5, minWidth: 35}, style]}
      />
    );
  }
}

export class LanguageIcon extends Component {
  onPress = () => {
    if (this.props.onPress) {
      this.props.onPress();
    }
  };
  render() {
    const {size, color, style} = this.props;
    return (
      <Entypo
        onPress={this.onPress}
        name="language"
        size={size ? size : 25}
        color={color ? color : 'black'}
        style={[{padding: 5, minWidth: 35}, style]}
      />
    );
  }
}

export class CategoryIcon extends Component {
  onPress = () => {
    if (this.props.onPress) {
      this.props.onPress();
    }
  };
  render() {
    const {size, color, style} = this.props;
    return (
      <FontAwesome5
        name="award"
        onPress={this.onPress}
        size={size ? size : 25}
        color={color ? color : 'black'}
        style={[{padding: 5, minWidth: 35}, style]}
      />
    );
  }
}

export class AddIcon extends Component {
  onPress = () => {
    if (this.props.onPress) {
      this.props.onPress();
    }
  };
  render() {
    const {size, color, style} = this.props;
    return (
      <AntDesign
        name="pluscircle"
        onPress={this.onPress}
        size={size ? size : 25}
        color={color ? color : 'black'}
        style={[{padding: 5}, style]}
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
});

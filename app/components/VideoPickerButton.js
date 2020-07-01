//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Entypo from 'react-native-vector-icons/Entypo';

// create a component
class VideoPickerButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      video_list: [],
    };
  }
  onClickPicker = () => {
    ImagePicker.launchImageLibrary(
      {noData: true, mediaType: 'video', durationLimit: 90},
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          if (this.props.onSelectVideo) {
            this.props.onSelectVideo(
              response.uri,
              response.type,
              response.fileName,
              'uploaded',
              response.path,
            );
          } else {
            const video_info = {
              uri: response.uri,
              type: response.type,
              fileName: response.fileName,
            };
            this.setState({video_list: [...this.state.video_list, video_info]});
          }
        }
      },
    );
  };
  render() {
    const {onSelectVideo} = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.onClickPicker}>
          <Entypo name={'folder-video'} size={30} color={'white'} />
        </TouchableOpacity>
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
});

//make this component available to the app
export default VideoPickerButton;

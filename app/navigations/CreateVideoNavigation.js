//import liraries
import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import VideoRecorder from '../components/VideoRecorder';
import VideoDraft from '../components/VideoDraft';
import VideoEditor from '../components/VideoEditor';

// create a component

const CreateVideoStack = createStackNavigator();
class CreateVideoNavigation extends Component {
  componentWillUnmount() {
    this.props.clearVideoList();
  }

  render() {
    return (
      <CreateVideoStack.Navigator
        initialRouteName="VideoRecorder"
        screenOptions={{
          headerShown: false,
        }}>
        <CreateVideoStack.Screen
          name="VideoRecorder"
          component={VideoRecorder}
          initialParams={{}}
        />
        <CreateVideoStack.Screen
          name="VideoDraft"
          component={VideoDraft}
          initialParams={{}}
        />
        <CreateVideoStack.Screen
          name="VideoEditor"
          component={VideoEditor}
          initialParams={{}}
        />
      </CreateVideoStack.Navigator>
    );
  }
}

//make this component available to the app
import {connect} from 'react-redux';
import {clearVideoList} from '../functions/CreateVideoFunctions';
const mapStateToProps = state => ({
  video_list: state.CreateVideoReducer.video_list,
});

export default connect(mapStateToProps, {clearVideoList})(
  CreateVideoNavigation,
);
// export default CreateVideoNavigation;
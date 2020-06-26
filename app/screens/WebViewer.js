//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';

// create a component
class WebVeiwer extends Component {
  webView = {
    canGoBack: false,
    ref: null,
  };

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
    });
  }

  onAndroidBackPress = () => {
    if (this.webView.canGoBack && this.webView.ref) {
      this.webView.ref.goBack();
      return true;
    }
    return false;
  };

  componentWillMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.onAndroidBackPress,
      );
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

  render() {
    const {url, ...props} = this.props.route.params;
    return (
      <View style={{flex: 1}}>
        <WebView
          style={{flex: 1}}
          javaScriptEnabled={true}
          ref={webView => {
            this.webView.ref = webView;
          }}
          onNavigationStateChange={navState => {
            this.webView.canGoBack = navState.canGoBack;
          }}
          allowsFullscreenVideo={true}
          domStorageEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          source={{uri: url}}
          {...props}
        />
      </View>
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
export default WebVeiwer;

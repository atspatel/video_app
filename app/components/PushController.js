import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import firebase from 'react-native-firebase';

import * as RootNavigationRef from '../../RootNavigationRef';
import {getToken, update_token_mapping} from '../functions/FirebaseActions';

class PushController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fcmToken: null,
      ann_token: null,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.createNotificationListeners = this.createNotificationListeners.bind(
      this,
    );
  }

  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners(); //add this line
  }

  componentDidUpdate() {
    if (
      this.props.AnnonymousToken &&
      this.state.ann_token != this.props.AnnonymousToken
    ) {
      this.setState({ann_token: this.props.AnnonymousToken});
      update_token_mapping();
    }
  }

  componentWillUnmount() {
    this.notificationListener;
    this.notificationOpenedListener;
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      getToken().then(fcmToken => this.setState({fcmToken: fcmToken}));
    } else {
      this.requestPermission();
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      getToken().then(fcmToken => this.setState({fcmToken: fcmToken}));
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  redirect_to_screen(type, id, tag) {
    if (type == 'video') {
      RootNavigationRef.navigate('VideoPage', {video_id: id});
    } else if (type == 'hashtag') {
      RootNavigationRef.navigate('HashtagScreen', {
        hashtag: {id: id, tag: tag},
      });
    }
  }

  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    const channel = new firebase.notifications.Android.Channel(
      'keypoints_channel_1',
      'KeyPoints',
      firebase.notifications.Android.Importance.High,
    )
      .setDescription('Demo app description')
      .setSound('default');
    firebase.notifications().android.createChannel(channel);

    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const localNotification = new firebase.notifications.Notification({
          sound: 'default',
          show_in_foreground: true,
        })
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setBody(notification.body)
          .setData(notification.data)
          .setSound('default')
          .android.setChannelId('keypoints_channel_1') // e.g. the id you chose above
          .android.setSmallIcon('kp_notification_logo') // create this icon in Android Studio
          .android.setLargeIcon(notification.android.largeIcon)
          .android.setBigPicture(notification.android.bigPicture.picture, null)
          .android.setColor(notification.android.color) // you can set a color here
          .android.setVibrate(1000)
          .android.setPriority(firebase.notifications.Android.Priority.High)
          .android.setAutoCancel(true);

        firebase
          .notifications()
          .displayNotification(localNotification)
          .catch(err => console.warn(err));
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const {type, key_1, tag} = notificationOpen.notification.data;
        this.redirect_to_screen(type, key_1, tag);
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    await firebase
      .notifications()
      .getInitialNotification()
      .then(notificationOpen => {
        if (notificationOpen) {
          const {type, key_1, tag} = notificationOpen.notification.data;
          this.redirect_to_screen(type, key_1, tag);
        }
      });

    this.messageListener = firebase.messaging().onMessage(message => {
      console.log('JSON.stringify:', JSON.stringify(message));
    });
  }

  render() {
    const {navigationRef} = this.props;
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

import {connect} from 'react-redux';
const mapStateToProps = state => ({
  AnnonymousToken: state.AuthReducer.AnnonymousToken,
});
//make this component available to the app
export default connect(mapStateToProps, {})(PushController);
// export default PushController

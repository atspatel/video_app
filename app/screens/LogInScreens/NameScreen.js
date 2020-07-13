//import liraries
import React, {Component} from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {Text} from 'react-native-paper';
import ProfilePicUpload from '../../components/ProfilePicUpload';

import {PostUserBio} from '../../functions/AuthFunctions';
import * as theme from '../../constants/theme';

const dummy_url =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSDgTNKTeE985pM29w_MVlLv6Q6zXuK8qHKq4O0pcB_aWH4JbQV';

class NameScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fromProfile: false,
      isLoading: false,
      avatar: {
        type: 'label',
        label: '',
        image_uri: {
          uri: dummy_url,
          type: 'image/jpg',
          fileName: 'temp_image.jpg',
        },
      },
      FirstName: {
        text: null,
        error: null,
      },
      LastName: {
        text: null,
        error: null,
      },

      isSubmissionError: false,
    };
  }

  onChangeProfilePic(response) {
    this.setState({
      avatar: {
        ...this.state.avatar,
        type: 'image',
        image_uri: {
          uri: response.uri,
          type: response.type,
          fileName: response.fileName,
        },
      },
    });
  }

  onPressDeleteProfilePic = () => {
    this.setState(
      {
        avatar: {...this.state.avatar, type: 'label'},
      },
      () => this.set_avatar_label(),
    );
  };

  set_avatar_label() {
    if (this.state.avatar.type != 'image') {
      var label_string = '';
      if (this.state.FirstName.text) {
        label_string = this.state.FirstName.text.substring(0, 1);
      }
      if (this.state.LastName.text) {
        label_string = label_string + this.state.LastName.text.substring(0, 1);
      }
      this.setState({
        avatar: {...this.state.avatar, label: label_string, type: 'label'},
      });
    }
  }

  _onChangeText(key, text) {
    this.setState({[key]: {text: text, error: null}}, () => {
      this.set_avatar_label();
    });
  }

  async validate_form() {
    this.setState({isSubmissionError: false});
    if (!this.state.FirstName.text) {
      var name_text = this.state.FirstName.text;
      this.setState({
        FirstName: {text: name_text, error: true},
        isSubmissionError: true,
      });
    }
  }

  submit_screen1_form = () => {
    this.validate_form().then(() => {
      if (!this.state.isSubmissionError) {
        this.props.PostUserBio(this.state);
      }
    });
  };

  componentDidUpdate() {
    if (this.props.user_name) {
      this.props.navigation.navigate('ProfileNavigation', {user: 'self'});
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.isLoading} />
        <View style={styles.formContainer}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: theme.logoColor,
              borderBottomLeftRadius: 150,
            }}>
            <View style={{paddingBottom: 20}}>
              <ProfilePicUpload
                avatar={this.state.avatar}
                onChangeProfilePic={this.onChangeProfilePic.bind(this)}
                onPressDeleteProfilePic={this.onPressDeleteProfilePic}
              />
            </View>
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', paddingTop: 20}}>
              <TextInput
                placeholder={'First Name*'}
                placeholderTextColor={
                  this.state.FirstName.error ? 'red' : '#DDD'
                }
                value={this.state.FirstName.text}
                onChangeText={text => this._onChangeText('FirstName', text)}
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  flex: 1,
                  fontSize: 20,
                  borderBottomWidth: 1,
                  marginHorizontal: 5,
                }}
              />
              <TextInput
                placeholder={'Last Name'}
                placeholderTextColor={'#DDD'}
                value={this.state.LastName.text}
                onChangeText={text => this._onChangeText('LastName', text)}
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  flex: 1,
                  fontSize: 20,
                  borderBottomWidth: 1,
                  marginHorizontal: 5,
                }}
              />
            </View>
            <TouchableOpacity onPress={this.submit_screen1_form}>
              <Text style={styles.button_style}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  formContainer: {
    flex: 1,
  },
  button_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'stretch',
  },
  radioContainer: {
    flex: 1,
    alignItems: 'center',
  },
  borderRight: {
    borderRightWidth: 1,
    height: '80%',
    alignSelf: 'center',
  },
  buttonBg: {
    backgroundColor: '#DDD',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: theme.fontFamily,
    fontSize: 20,
  },
  button_style: {
    fontFamily: theme.fontFamily,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
    backgroundColor: theme.logoColor,
    marginTop: 20,
    marginHorizontal: 25,
    padding: 5,
    borderRadius: 10,
  },
});

import {connect} from 'react-redux';
const mapStateToProps = state => ({
  user_name: state.AuthReducer.user_name,
});

export default connect(mapStateToProps, {PostUserBio})(NameScreen);

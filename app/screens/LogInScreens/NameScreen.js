//import liraries
import React, {Component} from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {Text} from 'react-native-paper';
import ProfilePicUpload from '../../components/ProfilePicUpload';

import {PostUserBio} from '../../functions/AuthFunctions';

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

  onPressDeleteProfilePic() {
    this.setState({
      avatar: {...this.state.avatar, type: 'label'},
    });
  }

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

  _render_button_section() {
    return (
      <View style={styles.button_container}>
        <TouchableOpacity
          onPress={this.submit_screen1_form}
          style={styles.buttonBg}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    return (
      <View style={[styles.container]}>
        <Spinner visible={this.state.isLoading} />
        <View style={styles.formContainer}>
          <ProfilePicUpload
            avatar={this.state.avatar}
            onChangeProfilePic={this.onChangeProfilePic.bind(this)}
            onPressDeleteProfilePic={this.onPressDeleteProfilePic.bind(this)}
          />
          <View style={{flexDirection: 'row'}}>
            <TextInput
              placeholder={'First Name*'}
              placeholderTextColor={this.state.FirstName.error ? 'red' : '#DDD'}
              value={this.state.FirstName.text}
              onChangeText={text => this._onChangeText('FirstName', text)}
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                flex: 1,
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
                borderBottomWidth: 1,
                marginHorizontal: 5,
              }}
            />
          </View>
        </View>
        {this._render_button_section()}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'white',
  },
  formContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderRadius: 10,
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
    fontFamily: 'serif',
    fontSize: 20,
  },
});

import {connect} from 'react-redux';
const mapStateToProps = state => ({
  user_name: state.AuthReducer.user_name,
});

export default connect(mapStateToProps, {PostUserBio})(NameScreen);

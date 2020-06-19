import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {Snackbar} from 'react-native-paper';
import CodeInput from 'react-native-confirmation-code-input';

import {Text, TextInputField} from '../../components';

import {connect} from 'react-redux';
import LogInfunc, {get_otp_function} from '../../functions/AuthFunctions';

// create a component

const SEND_OTP = 'Send OTP';
const LOG_IN = 'Log In';
class LogIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      otp_sent: false,
      otp: {
        text: null,
        error: false,
      },
      phone_number: {
        text: this.props.PhoneNumber,
        error: null,
      },
      FirstName: {
        text: null,
        error: null,
      },
      LastName: {
        text: null,
        error: null,
      },
      snackbar: {
        visible: false,
        message: null,
      },
      isLoading: false,
    };
    // this.onClickButton = this.onClickButton.bind(this)
  }
  close_snackbar() {
    this.setState({snackbar: {visible: false, message: null}});
  }

  validate_phone(phone_number) {
    var output = true;
    if (!phone_number || phone_number.length < 10) {
      output = false;
    }
    return output;
  }

  onSendOTP = async () => {
    var PhoneNumberError = false;
    if (!this.validate_phone(this.state.phone_number.text)) {
      PhoneNumberError = true;
    }
    if (!PhoneNumberError) {
      this.setState({isLoading: true});
      await get_otp_function(this.state.phone_number.text).then(response => {
        if (response.status) {
          this.setState({
            otp_sent: true,
            isLoading: false,
            snackbar: {
              message: 'OTP Sent',
              visible: true,
            },
          });
        } else {
          this.setState({
            isLoading: false,
            snackbar: {
              message: response.message,
              visible: true,
            },
          });
        }
      });
    } else {
      this.setState({
        phone_number: {...this.state.phone_number, error: PhoneNumberError},
      });
    }
  };

  onClickButton = async () => {
    if (!this.state.otp_sent) {
      this.onSendOTP();
    } else {
      await this.props.LogInfunc(
        this.state.phone_number.text,
        this.state.otp.text,
        this.props.ann_token,
      );
    }
  };

  onCodeFilled(code) {
    this.setState({otp: {text: code, error: null}}, () => this.onClickButton());
  }

  render_otp() {
    if (this.state.otp_sent) {
      return (
        <View>
          <CodeInput
            keyboardType="numeric"
            className={'border-circle'}
            codeLength={4}
            size={50}
            space={10}
            cellBorderWidth={2}
            activeColor={
              this.state.otp.error ? 'rgba(255, 0, 0, 1)' : 'rgba(0, 0, 0, 1)'
            }
            inactiveColor={
              this.state.otp.error
                ? 'rgba(255, 0, 0, 0.2)'
                : 'rgba(0, 0, 0, 0.2)'
            }
            containerStyle={{marginVertical: 5}}
            inputPosition="center"
            onFulfill={code => this.onCodeFilled(code)}
          />
          <View style={{alignItems: 'flex-end', height: 60}}>
            <TouchableOpacity onPress={() => this.onSendOTP()}>
              <Text hlink style={{marginTop: 5, color: 'black'}}>
                Resend
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  render_name_input() {
    const {FirstName, LastName} = this.state;
    return (
      <View style={{flexDirection: 'row'}}>
        <TextInput
          placeholder={'First Name*'}
          placeholderTextColor={FirstName.error ? 'red' : '#999'}
          value={FirstName.text}
          onChangeText={text => this.setState({FirstName: text})}
          style={{
            fontWeight: 'bold',
            flex: 1,
            borderBottomWidth: 1,
            marginHorizontal: 5,
          }}
        />
        <TextInput
          placeholder={'Last Name'}
          placeholderTextColor={'#999'}
          value={LastName.text}
          onChangeText={text => this.setState({LastName: text})}
          style={{
            fontWeight: 'bold',
            flex: 1,
            borderBottomWidth: 1,
            marginHorizontal: 5,
          }}
        />
      </View>
    );
  }

  onChangeText(text) {
    this.setState({
      phone_number: {text: text, error: false},
      otp_sent: false,
    });
  }

  componentDidUpdate() {
    if (this.props.Token) {
      this.props.navigation.navigate('ProfileNavigation', {user: 'self'});
    } else if (this.props.LogInError != this.state.otp.error) {
      this.setState({
        otp: {
          text: null,
          error: this.props.LogInError,
        },
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Spinner visible={this.state.isLoading} /> */}
        <View style={{height: 50}}>
          <Text
            hlink
            style={{alignSelf: 'flex-end', marginTop: 20, color: '#888'}}
            onPress={() => this.props.navigation.navigate('HomeTab')}>
            Skip
          </Text>
        </View>
        <View
          style={[{flex: 1, alignContent: 'center', justifyContent: 'center'}]}>
          <Text
            h1
            style={{
              fontSize: 15,
              color: 'black',
              alignSelf: 'center',
              fontFamily: 'serif',
            }}>
            Welcome to
          </Text>
          <Text
            h1
            style={{
              fontSize: 25,
              color: 'black',
              alignSelf: 'center',
              fontFamily: 'serif',
            }}>
            KeyPoints
          </Text>
          <TextInputField
            mode={'flat'}
            style={{
              backgroundColor: 'white',
              fontSize: 20,
            }}
            maxLength={10}
            label="Phone Number"
            autoCompleteType={'tel'}
            value={this.state.phone_number.text}
            onChangeText={text => this.onChangeText(text)}
            error={this.state.phone_number.error}
            dataDetectorTypes={'phoneNumber'}
            keyboardType={'numeric'}
          />
          {this.render_otp()}
          <TouchableOpacity onPress={() => this.onClickButton()}>
            <View
              style={{
                backgroundColor: 'black',
                marginTop: 5,
                marginHorizontal: 25,
                padding: 5,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontFamily: 'serif',
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 18,
                }}>
                {this.state.otp_sent ? LOG_IN : SEND_OTP}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{height: 50}}></View>
        <Snackbar
          visible={this.state.snackbar.visible}
          onDismiss={() => this.close_snackbar()}
          action={{
            label: 'Dismiss',
            onPress: () => {
              this.close_snackbar();
            },
          }}>
          {this.state.snackbar.message}
        </Snackbar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#DDD',
    paddingHorizontal: 15,
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  underlineStyleHighLighted: {
    borderColor: 'black',
  },
});

const mapStateToProps = state => ({
  Token: state.AuthReducer.Token,
  LogInError: state.AuthReducer.LogInError,
  PhoneNumber: state.AuthReducer.PhoneNumber,
  ann_token: state.AuthReducer.AnnonymousToken,
});

export default connect(mapStateToProps, {LogInfunc})(LogIn);

//import liraries
import React, {Component} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TextInput,
  Alert,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ProfilePicUpload from '../../components/ProfilePicUpload';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import debounce from 'lodash.debounce';

import SelectLangCat from '../../components/SelectLangCat';
import {Text} from '../../components';
import {LogOutfunc, PostCreatorBio} from '../../functions/AuthFunctions';
import {get_options} from '../../functions/CategoryFunctions';
import {check_username} from '../../functions/CreatorApi';
// create a component
class NameInput extends Component {
  render() {
    const {FirstName, LastName, onChangeText} = this.props;
    return (
      <View style={{flexDirection: 'row'}}>
        <TextInput
          placeholder={'First Name*'}
          placeholderTextColor={FirstName.error ? 'red' : '#DDD'}
          value={FirstName.text}
          onChangeText={text => onChangeText('FirstName', text)}
          style={{
            fontWeight: 'bold',
            flex: 1,
            borderBottomWidth: 1,
            marginHorizontal: 5,
          }}
        />
        <TextInput
          placeholder={'Last Name'}
          placeholderTextColor={'#DDD'}
          value={LastName.text}
          onChangeText={text => onChangeText('LastName', text)}
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
}

const dummy_url =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSDgTNKTeE985pM29w_MVlLv6Q6zXuK8qHKq4O0pcB_aWH4JbQV';
class SettingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: {
        type: 'image',
        label: '',
        image_uri: {
          uri: dummy_url,
          type: 'image/jpg',
          fileName: 'temp_image.jpg',
        },
      },
      username: {text: null, error: null},
      isChecking: false,
      about: null,
      FirstName: {
        text: null,
        error: null,
      },
      LastName: {
        text: null,
        error: null,
      },

      languages: {
        options_list: [],
        selected_list: [],
        error: false,
      },
      categories: {
        options_list: [],
        selected_list: [],
        error: false,
      },
    };
    this.onChangeTextDelayed = debounce(this.checkUsername, 500);
  }

  onChangeProfilePic = response => {
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
  };

  onPressDeleteProfilePic = () => {
    this.setState({
      avatar: {...this.state.avatar, type: 'image'},
    });
  };

  onChangeText = (key, text) => {
    this.setState({[key]: {text: text, error: null}});
  };

  updateList = (key, selected_list, options_list) => {
    this.setState({
      [key]: {
        ...this.state[key],
        selected_list: selected_list,
        options_list: options_list,
      },
    });
  };

  onChangeUserName = text => {
    this.setState({
      username: {text: text, error: null, isValid: null},
    });
    this.onChangeTextDelayed();
  };

  checkUsername = () => {
    const {username} = this.state;
    if (username.text && username.text.length > 3) {
      this.setState({isChecking: true});
      check_username(this.state.username.text).then(response => {
        this.setState({
          username: {...this.state.username, isValid: response.status},
          isChecking: false,
        });
      });
    } else {
      this.setState({
        username: {...this.state.username, isValid: false},
      });
    }
  };

  validate_form = () => {
    let isValid = true;
    const {username, FirstName, categories, languages} = this.state;
    if (
      username.text === null ||
      username.text.length === 0 ||
      username.isValid === false
    ) {
      this.setState({username: {...username, error: true}});
      isValid = false;
    }
    if (FirstName.text === null || FirstName.text.length === 0) {
      this.setState({FirstName: {...FirstName, error: true}});
      isValid = false;
    }
    if (Object.keys(categories.selected_list).length === 0) {
      this.setState({categories: {...categories, error: true}});
      isValid = false;
    }
    if (Object.keys(languages.selected_list).length === 0) {
      this.setState({languages: {...languages, error: true}});
      isValid = false;
    }

    return isValid;
  };
  onClickSave = () => {
    if (this.validate_form()) {
      this.props.PostCreatorBio(this.state).then(response => {
        if (this.props.route.params) {
          const {onCallUpdate} = this.props.route.params;
          onCallUpdate ? onCallUpdate() : null;
        }
        let message;
        if (response.status) {
          message = 'Profile Updated.';
        } else {
          message = 'Error in Updating...';
        }
        Alert.alert(
          message,
          '',
          [
            {},
            {
              text: 'Ok',
              onPress: () => {
                null;
              },
            },
          ],
          {cancelable: false},
        );
      });
    }
  };
  onClickLogOut = () => {
    Alert.alert(
      'Are you Sure?',
      '',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'LogOut',
          onPress: () => {
            this.props.LogOutfunc();
            this.props.navigation.navigate('ProfileNavigation');
          },
        },
      ],
      {cancelable: false},
    );
  };

  array_to_object(array) {
    let new_obj = {};
    array.map(item => {
      new_obj[item.id] = item.tag;
    });
    return new_obj;
  }
  update_options = (languages_data, categories_data) => {
    const languages_selected = this.array_to_object(languages_data);
    const categories_selected = this.array_to_object(categories_data);
    get_options().then(response => {
      let languages_options = this.array_to_object(response.languages_options);
      let categories_options = this.array_to_object(
        response.categories_options,
      );
      Object.entries(languages_selected).map(([key, value]) => {
        delete languages_options[key];
      });
      Object.entries(categories_selected).map(([key, value]) => {
        delete categories_options[key];
      });
      this.setState({
        languages: {
          options_list: languages_options,
          selected_list: languages_selected,
          error: false,
        },
        categories: {
          options_list: categories_options,
          selected_list: categories_selected,
          error: false,
        },
      });
    });
  };
  componentDidMount() {
    const {user_id, user_data, onCallUpdate} = this.props.route.params;
    this.setState(
      {
        FirstName: {
          text: user_data.first_name,
          error: null,
        },
        LastName: {
          text: user_data.last_name,
          error: null,
        },
        username: {text: user_data.username, error: null},
        about: user_data.bio,
        avatar: {
          type: 'image',
          label: '',
          image_uri: {
            uri: user_data.profile_pic ? user_data.profile_pic : dummy_url,
            type: 'image/jpg',
            fileName: 'temp_image.jpg',
          },
        },
      },
      () => {
        this.update_options(
          user_data.languages_data,
          user_data.categories_data,
        );
        this.checkUsername();
      },
    );
  }

  render() {
    const {FirstName, LastName} = this.state;
    return (
      <View style={[styles.container]}>
        <View style={{height: 30}}>
          <Text
            hlink
            style={{alignSelf: 'flex-end', marginTop: 20, color: '#888'}}
            onPress={this.onClickLogOut}>
            Log Out
          </Text>
        </View>
        <ScrollView
          style={{flex: 1, minHeight: Dimensions.get('window').height - 300}}>
          <ProfilePicUpload
            avatar={this.state.avatar}
            onChangeProfilePic={this.onChangeProfilePic}
            onPressDeleteProfilePic={this.onPressDeleteProfilePic}
          />
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              marginHorizontal: 5,
              alignItems: 'center',
            }}>
            <FontAwesome name={'at'} size={20} />
            <TextInput
              // editable={false}
              placeholder={'username'}
              placeholderTextColor={this.state.username.error ? 'red' : '#DDD'}
              value={this.state.username.text}
              onChangeText={this.onChangeUserName}
              style={{
                fontSize: 18,
                flex: 1,
                fontWeight: 'bold',
                alignSelf: 'stretch',
              }}
            />
            {this.state.isChecking ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : this.state.username.isValid !== null ? (
              this.state.username.isValid ? (
                <FontAwesome name={'check-circle'} size={30} color={'green'} />
              ) : (
                <FontAwesome name={'times-circle'} size={30} color={'red'} />
              )
            ) : null}
          </View>
          <NameInput
            FirstName={FirstName}
            LastName={LastName}
            onChangeText={this.onChangeText}
          />
          <TextInput
            placeholder={'About'}
            numberOfLines={1}
            placeholderTextColor={'#DDD'}
            value={this.state.about}
            onChangeText={text => this.setState({about: text})}
            style={{
              borderBottomWidth: 1,
              alignSelf: 'stretch',
              marginHorizontal: 5,
            }}
          />
          <SelectLangCat
            title={'Your Expertise'}
            show_instruction={true}
            languages={this.state.languages}
            categories={this.state.categories}
            updateList={this.updateList}
            // show_icon={true}
          />
        </ScrollView>

        <View
          style={{
            backgroundColor: 'black',
            margin: 5,
            marginHorizontal: 75,
            padding: 5,
            borderRadius: 5,
          }}>
          <TouchableOpacity onPress={() => this.onClickSave()}>
            <Text
              style={{
                fontFamily: 'serif',
                textAlign: 'center',
                color: 'white',
                fontSize: 18,
              }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
});

//make this component available to the app
import {connect} from 'react-redux';
const mapStateToProps = state => ({});
export default connect(mapStateToProps, {LogOutfunc, PostCreatorBio})(
  SettingScreen,
);

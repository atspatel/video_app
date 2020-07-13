/// TODO:: Add Functionlity and Integrate to LogIn Flow

//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import ChoiceComponent from '../../components/ChoiceComponent';
import ProfilePic from '../../components/ProfilePic';
import * as theme from '../../constants/theme';

// create a component
const languages = [
  {
    id: 1,
    tag: 'हिन्दी',
    thumbnail: 'https://storage.googleapis.com/kp_videos/app_icons/hindi.png',
  },
  {
    id: 2,
    tag: 'English',
    thumbnail: 'https://storage.googleapis.com/kp_videos/app_icons/english.png',
  },
];

const categories = [
  {
    id: 1,
    tag: 'Politics',
    thumbnail:
      'https://storage.googleapis.com/kp_videos/app_icons/politics.png',
  },
  {
    id: 2,
    tag: 'World',
    thumbnail: 'https://storage.googleapis.com/kp_videos/app_icons/world.png',
  },
  {
    id: 3,
    tag: 'Tech',
    thumbnail: 'https://storage.googleapis.com/kp_videos/app_icons/tech.png',
  },
  {
    id: 4,
    tag: 'Sports',
    thumbnail: 'https://storage.googleapis.com/kp_videos/app_icons/sports.png',
  },
  {
    id: 5,
    tag: 'Markets',
    thumbnail: 'https://storage.googleapis.com/kp_videos/app_icons/market.png',
  },
  {
    id: 6,
    tag: 'Entertainment',
    thumbnail:
      'https://storage.googleapis.com/kp_videos/app_icons/entertainment.png',
  },
];

const profile_pic =
  'https://cdn2.iconfinder.com/data/icons/flatfaces-everyday-people-square/128/beard_male_man_face_avatar-512.png';
class ChoiceScreen extends Component {
  state = {
    categories: {itemList: categories, error: null},
    languages: {itemList: languages, error: null},
  };

  onUpdateList = (itemList, category) => {
    this.setState({[category]: {...this.state[category], itemList: itemList}});
  };

  onClickNext = () => {
    const {categories, languages} = this.state;
    const selected_categories = categories.itemList.filter(
      item => item.selected === true,
    );
    const selected_languages = languages.itemList.filter(
      item => item.selected === true,
    );
    console.warn(selected_categories, selected_languages);
    console.warn('Call save API Here');
  };

  render() {
    const {categories, languages} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.info_container}>
          <ProfilePic profile_pic={profile_pic} size={100} round={true} />
          <View style={{justifyContent: 'flex-end', marginRight: 10}}>
            <Text
              style={{
                fontFamily: theme.fontFamily,
                fontSize: 15,
                color: 'black',
              }}>
              Welcome,{' '}
            </Text>
            <Text
              style={{
                fontFamily: theme.fontFamily,
                fontWeight: 'bold',
                fontSize: 30,
                color: 'black',
              }}>
              Atish Patel
            </Text>
          </View>
        </View>
        <ChoiceComponent
          languages={languages}
          categories={categories}
          onUpdateList={this.onUpdateList}
        />
        <TouchableOpacity onPress={this.onClickNext}>
          <Text style={styles.button_style}>Next</Text>
        </TouchableOpacity>
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
  info_container: {
    backgroundColor: theme.logoColor,
    borderBottomRightRadius: 50,
    padding: 10,
    flexDirection: 'row-reverse',
    // alignItems: 'center',
  },
  choice_title: {
    fontFamily: theme.fontFamily,
    fontSize: 20,
    color: 'black',
    margin: 5,
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

//make this component available to the app
export default ChoiceScreen;

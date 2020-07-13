//import liraries
import React, {Component} from 'react';
import {ScrollView, View, StyleSheet, TouchableOpacity} from 'react-native';

import ChoiceComponent from '../../components/ChoiceComponent';
import {Text} from '../../components';
import {
  get_preferences,
  post_preferences,
} from '../../functions/CategoryFunctions';
import * as theme from '../../constants/theme';

class ChoiceScreen extends Component {
  state = {
    languages: {
      itemList: [],
      error: null,
    },
    categories: {
      itemList: [],
      error: null,
    },
  };

  onUpdateList = (itemList, category) => {
    this.setState({[category]: {...this.state[category], itemList: itemList}});
  };

  update_preferences = () => {
    get_preferences().then(response => {
      this.setState({
        languages: {
          itemList: response.languages.options_list,
          error: false,
        },
        categories: {
          itemList: response.categories.options_list,
          error: false,
        },
      });
    });
  };

  post_preferences = () => {
    const {languages, categories} = this.state;
    const lang_selected = languages.itemList
      .filter(item => item.selected === true)
      .map(item => item.id);
    const cat_selected = categories.itemList
      .filter(item => item.selected === true)
      .map(item => item.id);
    post_preferences(lang_selected, cat_selected).then(response => {
      if (response.status) {
        this.props.navigation.goBack();
      }
    });
  };
  componentDidMount() {
    this.update_preferences();
  }
  render() {
    const {languages, categories} = this.state;
    return (
      <View style={styles.container}>
        <ChoiceComponent
          small={true}
          title={'Preferences'}
          languages={languages}
          categories={categories}
          onUpdateList={this.onUpdateList}
        />
        <TouchableOpacity onPress={this.post_preferences}>
          <Text style={styles.button_style}>Save</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  button_style: {
    fontFamily: theme.fontFamily,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    backgroundColor: 'black',
    margin: 5,
    marginHorizontal: 75,
    padding: 5,
    borderRadius: 5,
  },
});

export default ChoiceScreen;

//import liraries
import React, {Component} from 'react';
import {ScrollView, View, StyleSheet, TouchableOpacity} from 'react-native';

import SelectLangCat from '../../components/SelectLangCat';
import {Text} from '../../components';
import {
  get_preferences,
  post_preferences,
} from '../../functions/CategoryFunctions';

class ChoiceScreen extends Component {
  state = {
    languages: {
      options_list: {},
      selected_list: {},
    },
    categories: {
      options_list: {},
      selected_list: {},
    },
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

  update_preferences = () => {
    get_preferences().then(response => {
      this.setState({
        languages: {
          options_list: response.languages.options_list,
          selected_list: response.languages.selected_list,
          error: false,
        },
        categories: {
          options_list: response.categories.options_list,
          selected_list: response.categories.selected_list,
          error: false,
        },
      });
    });
  };

  post_preferences = () => {
    const {languages, categories} = this.state;
    post_preferences(languages.selected_list, categories.selected_list).then(
      response => {
        console.warn(response);
      },
    );
  };
  componentDidMount() {
    this.update_preferences();
  }
  render() {
    return (
      <View style={styles.container}>
        <SelectLangCat
          title={'Preferences'}
          languages={this.state.languages}
          categories={this.state.categories}
          updateList={this.updateList}
        />
        <TouchableOpacity onPress={this.post_preferences}>
          <Text
            style={{
              backgroundColor: '#DDD',
              textAlign: 'center',
              padding: 10,
              marginHorizontal: 50,
              fontFamily: 'serif',
              fontWeight: 'bold',
              fontSize: 18,
              borderRadius: 10,
              marginTop: 5,
            }}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export default ChoiceScreen;

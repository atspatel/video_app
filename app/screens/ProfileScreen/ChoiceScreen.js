//import liraries
import React, {Component} from 'react';
import {ScrollView, View, StyleSheet, TextInput} from 'react-native';

import SelectLangCat from '../../components/SelectLangCat';
import {Text} from '../../components';

class ChoiceScreen extends Component {
  state = {
    languages: {
      options_list: {1: 'Hindi', 2: 'English'},
      selected_list: [],
    },
    categories: {
      options_list: {1: 'Hindi', 2: 'English'},
      selected_list: [],
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

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <SelectLangCat
            style={{flex: 1}}
            title={'Preferences'}
            languages={this.state.languages}
            categories={this.state.categories}
            updateList={this.updateList}
          />
        </View>
        <View style={{alignItems: 'center'}}>
          <Text>Update</Text>
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

export default ChoiceScreen;

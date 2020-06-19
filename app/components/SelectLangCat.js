//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import SelectChoiceChips from './ChoiceComponent';
import * as chipHelperFun from '../functions/formChoiceChipHelpers';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const LANGUAGE_ICON = (
  <Entypo
    name="language"
    size={25}
    color="blue"
    style={{alignSelf: 'center', width: 30}}
  />
);

const CATEGORY_ICON = (
  <FontAwesome5
    name="award"
    size={25}
    color="blue"
    style={{alignSelf: 'center', width: 30}}
  />
);

class SelectLangCat extends Component {
  state = {};
  onCloseChip = (key, item) => {
    chipHelperFun
      .onCloseChip(
        item,
        this.props[key].selected_list,
        this.props[key].options_list,
      )
      .then(output =>
        this.props.updateList
          ? this.props.updateList(
              key,
              output.selected_list,
              output.options_list,
            )
          : null,
      );
  };
  onSelectChip = (key, item) => {
    chipHelperFun
      .onSelectChip(
        item,
        this.props[key].selected_list,
        this.props[key].options_list,
      )
      .then(output =>
        this.props.updateList
          ? this.props.updateList(
              key,
              output.selected_list,
              output.options_list,
            )
          : null,
      );
  };
  renderMainTitle(title) {
    return (
      <View
        style={{
          alignItems: 'center',
          alignSelf: 'stretch',
          backgroundColor: 'black',
          borderRadius: 10,
        }}>
        <Text>
          <Text style={{fontWeight: 'bold', fontSize: 20, color: 'white'}}>
            {title}
          </Text>
        </Text>
      </View>
    );
  }
  renderTitle(title, instruction, icon) {
    return (
      <View
        style={{
          paddingTop: 10,
          borderBottomWidth: 2,
          alignItems: 'center',
          alignSelf: 'stretch',
        }}>
        <Text>
          <Text style={{fontWeight: 'bold', fontSize: 20}}> {title} </Text>
          {icon}
          <Text style={{fontSize: 10}}>{instruction}</Text>
        </Text>
      </View>
    );
  }
  render() {
    const {title, languages, categories, show_icon, style} = this.props;
    return (
      <View
        style={[
          {
            backgroundColor: '#EEE',
            borderWidth: 1,
            padding: 10,
            marginTop: 10,
            borderRadius: 10,
          },
          style,
        ]}>
        {title ? this.renderMainTitle(title) : null}
        {this.renderTitle(
          'Select Languages',
          '(Min 1)',
          show_icon ? LANGUAGE_ICON : null,
        )}
        <SelectChoiceChips
          stateKey="languages"
          selected_list={languages.selected_list}
          options_list={languages.options_list}
          onCloseChip={this.onCloseChip}
          onSelectChip={this.onSelectChip}
          editable={false}
        />
        {this.renderTitle(
          'Select Categories',
          '(Max 4)',
          show_icon ? CATEGORY_ICON : null,
        )}
        <SelectChoiceChips
          stateKey="categories"
          selected_list={categories.selected_list}
          options_list={categories.options_list}
          onCloseChip={this.onCloseChip}
          onSelectChip={this.onSelectChip}
          editable={false}
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
export default SelectLangCat;

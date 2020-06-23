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
      .then(output => {
        this.props.updateList
          ? this.props.updateList(
              key,
              output.selected_list,
              output.options_list,
            )
          : null;
      });
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
  render() {
    let {
      title,
      languages,
      categories,
      show_icon,
      style,
      show_instruction,
    } = this.props;
    const isLanguage = languages ? true : false;
    const isCategory = categories ? true : false;
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
        {isLanguage ? (
          <View>
            <SelectChoiceChips
              title={'Select Languages'}
              instruction={show_instruction ? '(Min 1)' : null}
              icon={show_icon ? LANGUAGE_ICON : null}
              stateKey="languages"
              selected_list={languages.selected_list}
              options_list={languages.options_list}
              onCloseChip={this.onCloseChip}
              onSelectChip={this.onSelectChip}
              editable={false}
            />
          </View>
        ) : null}
        {isCategory ? (
          <View>
            <SelectChoiceChips
              title={'Select Categories'}
              instruction={show_instruction ? '(Max 4)' : null}
              icon={show_icon ? CATEGORY_ICON : null}
              stateKey="categories"
              selected_list={categories.selected_list}
              options_list={categories.options_list}
              onCloseChip={this.onCloseChip}
              onSelectChip={this.onSelectChip}
              editable={false}
            />
          </View>
        ) : null}
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

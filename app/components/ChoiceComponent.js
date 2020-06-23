//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Chip} from 'react-native-paper';

import * as chipHelperFun from '../functions/formChoiceChipHelpers';

const maxChipItemDisplayLen = 20;
// create a component
class SelectChoiceChips extends Component {
  async onCloseChip(key, item) {
    if (this.props.onCloseChip) {
      this.props.onCloseChip(key, item);
    }
  }

  async onSelectChip(key, item) {
    if (this.props.onSelectChip) {
      this.props.onSelectChip(key, item);
    }
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
          {instruction ? (
            <Text style={{fontSize: 10}}>{instruction}</Text>
          ) : null}
        </Text>
      </View>
    );
  }

  renderSelectedChips(props) {
    const stateKey = this.props.stateKey;
    const chipList = this.props.selected_list ? this.props.selected_list : {};
    return (
      <>
        {Object.keys(chipList).map(item => {
          return (
            <Chip
              key={item}
              icon="checkbox-marked-circle-outline"
              onPress={() =>
                this.onCloseChip(stateKey, {[item]: chipList[item]})
              }
              style={styles.selected_chip_style}
              textStyle={[styles.selected_chip_text_style]}
              {...props}>
              {chipHelperFun._getItemString(
                chipList[item],
                maxChipItemDisplayLen,
              )}
            </Chip>
          );
        })}
      </>
    );
  }

  renderChips(props) {
    const stateKey = this.props.stateKey;
    const chipList = this.props.options_list ? this.props.options_list : {};
    return (
      <>
        {Object.keys(chipList).map(item => {
          return (
            <Chip
              key={item}
              icon="plus-circle-outline"
              onPress={() =>
                this.onSelectChip(stateKey, {[item]: chipList[item]})
              }
              style={styles.chip_style}
              textStyle={[styles.chip_text_style]}
              {...props}>
              {chipHelperFun._getItemString(
                chipList[item],
                maxChipItemDisplayLen,
              )}
            </Chip>
          );
        })}
      </>
    );
  }

  render() {
    const {
      stateKey,
      title,
      instruction,
      icon,
      selected_list,
      options_list,
      onSelectChip,
      onCloseChip,
    } = this.props;
    return (
      <View style={styles.container}>
        {title ? this.renderTitle(title, instruction, icon) : null}
        <View style={[styles.chip_container]}>
          {this.renderSelectedChips()}
          {this.renderChips()}
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {},
  chip_container: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  chip_text_style: {
    fontSize: 15,
    color: 'black',
  },
  selected_chip_text_style: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
  chip_style: {
    backgroundColor: 'white',
    marginHorizontal: 2,
    marginVertical: 2,
    borderColor: 'black',
    borderWidth: 1,
  },
  selected_chip_style: {
    backgroundColor: 'lightblue',
    marginHorizontal: 2,
    marginVertical: 2,
    borderColor: 'black',
    borderWidth: 1,
  },
});

//make this component available to the app
export default SelectChoiceChips;

//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import * as theme from '../constants/theme';

// create a component
class ChoiceItem extends Component {
  render() {
    const {small, item, onPress} = this.props;
    const bgColor = item.selected ? theme.logoColor : 'white';
    const color = item.selected ? 'white' : 'black';
    return (
      <View
        style={{
          width: small ? 75 : 110,
          height: small ? 75 : 110,

          margin: 5,

          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bgColor,

          borderRadius: small ? 28 : 44,
          borderWidth: 1,
        }}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
          }}
          onPress={() => onPress && onPress(item.id)}>
          <Image
            source={{uri: item.thumbnail}}
            style={{
              height: small ? 30 : 50,
              width: small ? 30 : 50,
              resizeMode: 'cover',
            }}
          />
          <Text
            adjustsFontSizeToFit={true}
            numberOfLines={2}
            style={{
              fontFamily: theme.fontFamily,
              fontSize: small ? 10 : 13,
              fontWeight: 'bold',
              color: color,
              marginTop: 5,
              textAlign: 'center',
            }}>
            {item.tag}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class SelectionComp extends Component {
  render() {
    const {small, itemList, title, onToggleSelect} = this.props;
    return (
      <View style={{marginHorizontal: 10, marginTop: 10, alignItems: 'center'}}>
        <Text style={styles.choice_title}>{title}</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          {itemList.map(item => {
            return (
              <ChoiceItem
                small={small}
                key={item.id}
                item={item}
                onPress={id => onToggleSelect && onToggleSelect(id)}
              />
            );
          })}
        </View>
      </View>
    );
  }
}

class ChoiceComponent extends Component {
  state = {
    categories: {itemList: [], error: null},
    languages: {itemList: [], error: null},
  };

  onToggleSelect = (id, category) => {
    let itemList = this.state[category].itemList.map(item => {
      if (item.id === id) {
        return {...item, selected: !(item.selected ? item.selected : false)};
      } else {
        return item;
      }
    });
    this.setState(
      {[category]: {...this.state[category], itemList: itemList}},
      () => {
        this.props.onUpdateList && this.props.onUpdateList(itemList, category);
      },
    );
  };

  componentDidUpdate(prevProps) {
    const {categories, languages} = this.props;
    const {categories: prev_categories, languages: prev_languages} = prevProps;
    if (
      categories !== prev_categories &&
      categories !== this.state.categories
    ) {
      this.setState({categories: categories});
    }
    if (languages !== prev_languages && languages !== this.state.languages) {
      this.setState({languages: languages});
    }
  }

  componentDidMount() {
    const {categories, languages} = this.props;
    this.setState({categories, languages});
  }

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
    const {categories, languages} = this.state;
    const {title, small} = this.props;
    return (
      <View style={styles.container}>
        {this.renderMainTitle(title)}
        <SelectionComp
          small={small}
          itemList={languages.itemList}
          title={'Select Lanaguages'}
          onToggleSelect={id => this.onToggleSelect(id, 'languages')}
        />
        <SelectionComp
          small={small}
          title={'Select Categories'}
          itemList={categories.itemList}
          onToggleSelect={id => this.onToggleSelect(id, 'categories')}
        />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 10,
    overflow: 'hidden',
  },
  choice_title: {
    fontFamily: theme.fontFamily,
    fontSize: 20,
    color: 'black',
    margin: 5,
  },
});

//make this component available to the app
export default ChoiceComponent;

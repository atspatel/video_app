//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ShareIcon} from '../constants/icon';
// import {connect} from 'react-redux';

import {ConnectedTitleModal} from './HeaderTitle';
import {setCategory, getCategories} from '../functions/CategoryFunctions';

import * as RootNavigation from '../../RootNavigationRef';

// create a component
export class CreateFAB extends Component {
  onPressFAB() {
    RootNavigation.navigate('CreateScreen');
  }
  render() {
    return (
      <FAB
        style={[
          styles.fabButton,
          {width: 60, height: 60, borderRadius: 30, borderWidth: 3},
        ]}
        icon={props => {
          return (
            <MaterialCommunityIcons
              name="plus"
              size={40}
              color={'white'}
              style={{
                margin: -10,
                alignSelf: 'center',
                alignItems: 'center',
              }}
            />
          );
        }}
        onPress={this.onPressFAB.bind(this)}
      />
    );
  }
}

export class ShareFAB extends Component {
  state = {};
  onPressShare = () => {
    if (this.props.onPress) {
      this.props.onPress();
    }
  };
  render() {
    return (
      <FAB
        style={[
          styles.fabButton,
          {
            width: 50,
            height: 50,
            borderRadius: 30,
            borderWidth: 1,
            backgroundColor: 'black',
            borderColor: 'black',
          },
        ]}
        small
        icon={props => {
          return (
            <ShareIcon
              size={30}
              color="white"
              style={{
                margin: -10,
                alignSelf: 'center',
                alignItems: 'center',
              }}
            />
          );
        }}
        color={'white'}
        onPress={this.onPressShare.bind(this)}
      />
    );
  }
}
class BottomFAB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      navigation: null,
      category: null,
    };
  }
  onSelectCategory(category) {
    this.closeModal();
    this.props.setCategory(category);
  }

  onPressFAB() {
    this.setState({isVisible: !this.state.isVisible});
  }

  closeModal() {
    this.setState({isVisible: false});
  }

  checkCategory(category, category_options) {
    return category_options.some(item => category.id === item.id);
  }

  componentDidUpdate() {
    const {category, category_options} = this.props;
    if (
      category_options.length > 0 &&
      (category === null || !this.checkCategory(category, category_options))
    ) {
      this.props.setCategory(category_options[0]);
    } else if (category != this.state.category) {
      this.setState({category: category});
    }
  }
  componentDidMount() {
    this.props.getCategories();
  }
  render() {
    const {category} = this.state;
    // const navigation = useNavigation();
    return category ? (
      <View
        style={{
          position: 'absolute',
          bottom: 2,
          // left: 0,
          height: 40,
          width: '100%',
          alignItems: 'center',
        }}>
        <FAB
          style={styles.fabButton}
          small
          label={category.name}
          color={'white'}
          onPress={this.onPressFAB.bind(this)}></FAB>
        <ConnectedTitleModal
          isVisible={this.state.isVisible}
          closeModal={this.closeModal.bind(this)}
          onSelectCategory={this.onSelectCategory.bind(this)}
          position={'flex-end'}
        />
      </View>
    ) : null;
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
  fabButton: {
    backgroundColor: 'black',
    // width: 130,
    height: 40,
    borderWidth: 2,
    borderColor: 'white',
    padding: 0,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

//make this component available to the app

import {connect} from 'react-redux';

const mapStateToProps = state => ({
  category: state.CategoryReducer.category,
  category_options: state.CategoryReducer.category_options,
});

export default connect(mapStateToProps, {setCategory, getCategories})(
  BottomFAB,
);

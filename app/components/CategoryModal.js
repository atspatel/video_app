//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Modal from 'react-native-modal';

import ProfilePic from './ProfilePic';

import {getUserData} from '../functions/CreatorApi';
import {setCategory, getCategories} from '../functions/CategoryFunctions';

// create a component

class UserDrawerInfo extends Component {
  render() {
    const {user_data} = this.props;
    return user_data ? (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 200,
          // backgroundColor: 'lightblue',
        }}>
        <ProfilePic
          profile_pic={user_data.profile_pic}
          user_name={user_data.name}
          size={120}
        />
        <Text
          style={{
            fontFamily: 'serif',
            fontSize: 18,
            color: 'black',
            marginTop: 10,
          }}
          numberOfLines={1}>
          {user_data.name ? user_data.name : null}
        </Text>
      </View>
    ) : (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 200,
          // backgroundColor: 'lightblue',
        }}
      />
    );
  }
}
class SingleTitle extends Component {
  render() {
    const {title, onClick, isSelected} = this.props;
    return (
      <TouchableOpacity onPress={() => onClick(title)} activeOpacity={0.9}>
        <View
          style={{
            backgroundColor: isSelected ? '#FF644E' : 'white',
            borderColor: '#DDD',
            borderWidth: 1,
            borderRadius: 25,
            marginVertical: 1,
            flexDirection: isSelected ? 'row-reverse' : 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Image
            source={{uri: title.thumbnail}}
            style={{height: 30, width: 30, resizeMode: 'cover'}}
          />
          <View style={{padding: 10}}>
            <Text style={[styles.titleText]}>{title.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export class CategoryModal extends Component {
  state = {
    user_data: null,
    uesr_id: null,
    category: null,
  };
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
    }

    const {user_id} = this.props;
    if (this.state.user_id !== user_id) {
      this.setState({user_id: user_id}, () => {
        if (this.state.user_id) {
          getUserData(user_id).then(response => {
            this.setState({user_data: response.data[0]});
          });
        } else {
          this.setState({user_data: null});
        }
      });
    }
  }
  componentDidMount() {
    this.props.getCategories();

    const {user_id} = this.props;
    user_id &&
      getUserData(user_id).then(response => {
        this.setState({user_data: response.data[0]});
      });
  }
  render() {
    const {isVisible, closeModal, onSelectCategory} = this.props;
    const {category_options, category} = this.props;
    const {user_data} = this.state;
    return (
      <Modal
        isVisible={isVisible}
        animationIn={'slideInLeft'}
        animationOut={'slideOutLeft'}
        animationOutTiming={500}
        backdropTransitionOutTiming={0}
        onRequestClose={() => closeModal()}
        onBackdropPress={() => closeModal()}
        coverScreen={false}
        backdropColor={'black'}
        backdropOpacity={0.5}
        // onSwipeStart={() => console.warn('start')}
        // transparent
        style={{
          margin: 0,
          width: 200,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          overflow: 'hidden',
        }}>
        <View
          style={{
            width: 200,
            height: '100%',
            // justifyContent: 'center',
            alignItems: 'stretch',
            backgroundColor: 'white',
          }}>
          <UserDrawerInfo user_data={user_data} />
          {category_options.map(item => {
            return (
              <SingleTitle
                key={item.id.toString()}
                title={item}
                onClick={onSelectCategory}
                isSelected={category && item.id === category.id ? true : false}
              />
            );
          })}
          {/* </View> */}
        </View>
      </Modal>
    );
  }
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
  user_id: state.AuthReducer.user_id,
  category: state.CategoryReducer.category,
  category_options: state.CategoryReducer.category_options,
});

export const ConnectedCategoryModal = connect(mapStateToProps, {
  setCategory,
  getCategories,
})(CategoryModal);

// define your styles
const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'serif',
    fontSize: 16,
    height: 25,
    textAlign: 'center',
  },
});

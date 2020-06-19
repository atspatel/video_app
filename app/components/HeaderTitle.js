//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';

// create a component
class SingleTitle extends Component {
  render() {
    const {title, onClick} = this.props;
    return (
      <TouchableOpacity onPress={() => onClick(title)} activeOpacity={0.9}>
        <View
          style={{
            backgroundColor: 'white',
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            paddingVertical: 10,
            borderRadius: 5,
          }}>
          <Text style={styles.titleText}>{title.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export class TitleModal extends Component {
  render() {
    const {isVisible, closeModal, onSelectCategory, position} = this.props;
    const {category_options, category} = this.props;
    return (
      <Modal
        isVisible={isVisible}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        animationOutTiming={500}
        backdropTransitionOutTiming={0}
        backdropColor={'black'}
        onRequestClose={() => closeModal()}
        // onSwipeComplete={() => this.closeModal()}
        // swipeDirection="up"
        // onSwipeStart={() => console.warn('start')}
        // transparent
        style={{
          flex: 1,
          margin: 0,
          marginTop: 40,
          marginBottom: 40,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            alignItems: 'stretch',
            justifyContent: position,
          }}>
          {/* <View style={{justifyContent: position}}> */}
          {category_options.map(item => {
            return (
              <SingleTitle
                key={item.id.toString()}
                title={item}
                onClick={onSelectCategory}
                isSelected={item.id === category.id ? true : false}
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
  category: state.CategoryReducer.category,
  category_options: state.CategoryReducer.category_options,
});

export const ConnectedTitleModal = connect(mapStateToProps, {})(TitleModal);

// define your styles
const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'serif',
    fontSize: 20,
    height: 30,
    textAlign: 'center',
  },
});

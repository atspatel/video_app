import React from 'react';

import {StyleSheet, Text} from 'react-native';

// const styles = StyleSheet.create({
// defaultFontFamily: {
//     fontFamily: 'lucida grande',
//     },
// });

export default function fixTextCutOff() {
  if (Platform.OS !== 'android') {
    return;
  }

  const oldRender = Text.render;
  Text.render = function(...args) {
    const origin = oldRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: [{fontFamily: 'Roboto'}, origin.props.style],
    });
  };
}

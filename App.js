import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {persistor, store} from './store';

import MainAppNavigation from './app/navigations';

import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './RootNavigationRef';
import PushController from './app/components/PushController';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer ref={navigationRef}>
            <MainAppNavigation />
            <PushController />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#2c3e50',
  },
});

export default App;

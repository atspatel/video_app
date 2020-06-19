import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import {connect} from 'react-redux';
import {Text} from '../components';
// import Spinner from 'react-native-loading-spinner-overlay';

import {getAnnToken, setToken} from '../functions/AuthFunctions';
// import {made_choices} from '../../Actions/UserPreferenceActions';

// create a component
class Home extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    if (!this.props.AnnonymousToken) {
      this.props.getAnnToken();
    } else {
      setToken(this.props.AnnonymousToken, this.props.Token);
      this.props.navigation.navigate('BottomNavigation');
      // made_choices().then(res => {
      //   if (res) {
      //     this.props.navigation.navigate('MainOps');
      //   } else {
      //     this.props.navigation.navigate('CategoriesChoicesPage');
      //   }
      // });
    }
  }

  componentDidMount() {
    this.componentDidUpdate();
  }
  render() {
    return (
      <View
        style={[
          styles.container,
          {alignContent: 'stretch', justifyContent: 'center'},
        ]}>
        <View
          style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
          <Text
            h3
            style={{color: 'black', textAlign: 'center', fontFamily: 'serif'}}>
            Welcome to
          </Text>
          <Text
            h1
            style={{color: 'black', textAlign: 'center', fontFamily: 'serif'}}>
            KeyPoints
          </Text>
        </View>
        {/* <View style={{height: 100, alignSelf: 'flex-end'}}>
          <Spinner visible={true} />
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

const mapStateToProps = state => ({
  Token: state.AuthReducer.Token,
  AnnonymousToken: state.AuthReducer.AnnonymousToken,
});

export default connect(mapStateToProps, {getAnnToken})(Home);

//import liraries
import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {SearchBar, Icon} from 'react-native-elements';
import debounce from 'lodash.debounce';

import Collapsible from 'react-native-collapsible';

import UserAvatarList from './UserAvatarList';
import VideoAvatarList from './VideoAvatarList';
import * as theme from '../constants/theme';

// create a component
class DiscoverPage extends Component {
  constructor(props) {
    super(props);

    this.onChangeTextDelayed = debounce(this.call_search, 500);
  }
  state = {
    search: '',
    debounce_search: '',
    isCollapsed: false,
  };

  call_search = () => {
    this.setState({debounce_search: this.state.search});
  };
  updateSearch = search => {
    this.setState({search});
    this.onChangeTextDelayed();
  };
  onClickUser = user_id => {
    this.props.navigation.navigate('CreatorProfile', {user: user_id});
  };

  onScroll = (e, offsetX, offsetY) => {
    if (offsetY === 0) {
      this.setState({isCollapsed: false});
    } else {
      this.setState({isCollapsed: true});
    }
  };
  componentDidMount() {}
  componentWillUnmount() {}
  render() {
    const {search, isCollapsed} = this.state;
    return (
      <View style={styles.container}>
        <SearchBar
          placeholder="Search..."
          onChangeText={this.updateSearch}
          value={search}
          lightTheme
          round
          containerStyle={{
            padding: 5,
            paddingHorizontal: 10,
            backgroundColor: '#DDD',
          }}
          inputContainerStyle={{
            backgroundColor: 'white',
            padding: 0,
            borderRadius: 20,
          }}
          inputStyle={{color: 'black'}}
          searchIcon={<Icon name="search" color="black" size={30} />}
        />
        <Collapsible collapsed={isCollapsed}>
          <UserAvatarList
            label={'Users'}
            searchText={this.state.debounce_search}
            onClick={this.onClickUser}
          />
        </Collapsible>
        <VideoAvatarList
          label={'Trending'}
          qcat={'discover'}
          searchText={this.state.debounce_search}
          qid={1}
          onScroll={this.onScroll}
        />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  avtar_image: {
    height: 70,
    width: 70,
    resizeMode: 'cover',
    borderRadius: 40,
  },
});

//make this component available to the app
export default DiscoverPage;

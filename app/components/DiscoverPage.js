//import liraries
import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {SearchBar} from 'react-native-elements';
import debounce from 'lodash.debounce';

import UserAvatarList from './UserAvatarList';
// import ChannelAvatarList from './ChannelAvatarList';
import TopicAvatarList from './TopicAvatarList';
import VideoAvatarList from './VideoAvatarList';

// create a component
class DiscoverPage extends Component {
  constructor(props) {
    super(props);

    this.onChangeTextDelayed = debounce(this.call_search, 500);
  }
  state = {
    search: '',
    debounce_search: null,
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
  onClickTopic = id => {
    this.props.navigation.navigate('TopicScreen', {topic: id});
  };
  componentDidMount() {}
  componentWillUnmount() {}
  render() {
    const {search} = this.state;
    return (
      <View style={styles.container}>
        <SearchBar
          placeholder="Search..."
          onChangeText={this.updateSearch}
          value={search}
          containerStyle={{backgroundColor: 'white', padding: 0}}
          inputStyle={{color: 'white'}}
        />
        <UserAvatarList
          label={'Users'}
          searchText={this.state.debounce_search}
          onClick={this.onClickUser}
        />
        <VideoAvatarList
          label={'Trending Videos'}
          qcat={'discover'}
          searchText={this.state.debounce_search}
          qid={1}
          onClick={this.onClickTopic}
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
  avatar_name: {
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  follow_count: {
    fontFamily: 'serif',
  },
  follow_button: {
    fontFamily: 'serif',
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 5,
  },
});

//make this component available to the app
export default DiscoverPage;

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import TopicAvatarList from './TopicAvatarList';

class SingleTopicView extends Component {
  render() {
    const {topic, onClick} = this.props;
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => onClick(topic)}>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 2,
            padding: 5,
            borderRadius: 10,
            backgroundColor: '#DDD',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: topic.thumbnail}}
            resizeMode="stretch"
            style={{
              height: 75,
              width: 100,
              borderRadius: 10,
            }}
          />
          <View
            style={{
              justifyContent: 'center',
              marginHorizontal: 10,
              flex: 1,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'serif',
                fontWeight: 'bold',
              }}>
              {topic.name}
            </Text>
            <Text style={{fontSize: 14, fontFamily: 'serif'}}>
              Videos: {topic.videos} | Views: {topic.views}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={30} />
        </View>
      </TouchableOpacity>
    );
  }
}

class TopicFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      category: null,
    };
  }
  goToVidoeFeed = topic => {
    this.props.navigation.navigate('TopicScreen', {topic: topic});
  };
  componentDidUpdate() {
    const {category} = this.props;
    if (category && this.state.category != category) {
      this.setState({category: category});
    }
  }
  componentWillReceiveProps(prevProps) {
    if (this.state.focused) {
      const {isRefresh} = this.props.route.params
        ? this.props.route.params
        : {isRefresh: false};

      if (isRefresh) {
        this._topicList.scrollToOffset({animated: true, offset: 0});
      }
    }
  }

  componentDidMount() {
    this._focused = this.props.navigation.addListener('focus', route => {
      this.setState({focused: true});
      const {setRoute} = this.props.route.params
        ? this.props.route.params
        : {setRoute: null};
      if (setRoute) {
        setRoute('Topics');
      }
    });
    this._unfocused = this.props.navigation.addListener('blur', () => {
      this.setState({focused: false});
    });
  }
  componentWillUnmount() {
    this._focused();
    this._unfocused();
  }

  render() {
    const {onScroll} = this.props.route.params
      ? this.props.route.params
      : {onScroll: null};
    let {category} = this.state;
    return category ? (
      <View style={{flex: 1}}>
        <TopicAvatarList
          qcat={'categoty'}
          qid={category.id}
          label={`Trending Topics in ${category.name}`}
          onClick={this.onClickTopic}
          onScroll={onScroll}
        />
      </View>
    ) : null;
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  fabButton: {
    fontFamily: 'serif',
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'white',
    padding: 0,
    margin: 0,
  },
});

//make this component available to the app
// export default TopicFeed;
const mapStateToProps = state => ({
  category: state.CategoryReducer.category,
});

export default connect(mapStateToProps, {})(TopicFeed);

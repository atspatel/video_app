import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as RootNavigation from '../../RootNavigationRef';
import * as theme from '../constants/theme';
// import {get_follow_data} from '../Actions/ProfileActions';

// create a component
class HashTag extends Component {
  go_to_hashtag_page(hashtag) {
    RootNavigation.navigate('HashtagScreen', {hashtag: hashtag});
    //   get_follow_data(hashtag_id, 'keyword').then(response => {
    //     const is_followed = response.is_followed;
    //     this.props.navigation.navigate('HashTagPage', {
    //       tag_id: hashtag_id,
    //       tag: `#${tag}`,
    //       is_followed: is_followed,
    //     });
    //   });
  }
  render() {
    const {hashtag, style} = this.props;
    return (
      <View style={{marginRight: 10}}>
        <TouchableOpacity onPress={() => this.go_to_hashtag_page(hashtag)}>
          <Text style={[styles.hashtag_text, style]}>#{hashtag.tag}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// class HashTagTitle extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       tag: null,
//       is_followed: false,
//     };
//   }

//   componentDidUpdate() {
//     const tag = this.props.tag;
//     if (this.state.tag != tag) {
//       const is_followed = this.props.is_followed;
//       this.setState({is_followed: is_followed, tag: tag});
//     }
//   }
//   componentDidMount() {
//     const tag = this.props.tag;
//     if (this.state.tag != tag) {
//       const is_followed = this.props.is_followed;
//       this.setState({is_followed: is_followed, tag: tag});
//     }
//   }

//   onPressFollow(id) {
//     if (this.state.is_followed) {
//       delete_follow_data(id, 'keyword');
//     } else {
//       post_follow_data(id, 'keyword');
//     }
//     this.setState({is_followed: !this.state.is_followed});
//   }

//   render_follow_button() {
//     if (this.props.id != -1) {
//       return (
//         <MaterialCommunityIcons
//           onPress={() => this.onPressFollow(this.props.id)}
//           style={[styles.icon_style]}
//           name={this.state.is_followed ? 'minus-circle' : 'plus-circle'}
//           color={this.state.is_followed ? 'grey' : '#e91e63'}
//           size={25}
//         />
//       );
//     }
//   }

//   render() {
//     const {id, tag, is_followed} = this.props;
//     return (
//       <View style={{flexDirection: 'row', alignItems: 'center'}}>
//         <Text
//           adjustsFontSizeToFit={true}
//           allowFontScaling={false}
//           style={styles.header_title_text}>
//           {_getItemString(tag, 20)}
//         </Text>
//         {this.render_follow_button()}
//       </View>
//     );
//   }
// }

// define your styles
const styles = StyleSheet.create({
  hashtag_text: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'lightblue',
  },
  header_title_text: {
    fontFamily: theme.fontFamily,
    fontSize: 18,
    fontStyle: 'italic',
  },
  icon_style: {
    marginLeft: 5,
  },
});

export default HashTag;

//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';

import Modal from 'react-native-modal';
import {Chip} from 'react-native-paper';
import ParsedText from 'react-native-parsed-text';

import ChoiceComponent from './ChoiceComponent';
import {VideoPlayerModal} from './VideoDraft';
import {get_options} from '../functions/CategoryFunctions';
import {LanguageIcon, CategoryIcon, AddIcon} from '../constants/icon';
import * as chipHelperFun from '../functions/formChoiceChipHelpers';
import {upload_video_data} from '../functions/VideoUploadApi';
import * as theme from '../constants/theme';

const maxChipItemDisplayLen = 20;

const {width: winWidth, height: winHeight} = Dimensions.get('window');
// create a component
// const data = {
//   fileName: '8acd017c-d66b-4280-8ad5-f3e1ffd53b5e.mp4',
//   path:
//     '/storage/emulated/0/Android/data/com.crat.keypoints/cache/photo-3ecf6ca4-0381-4955-b62d-41d4a00461eb.mp4',
//   thumbnail_path:
//     'file:///storage/emulated/0/thumb/thumb-c94ce3aa-5df1-4e3d-8541-ec3b785ec968.jpeg',
//   type: 'video/mp4',
//   uri:
//     'file:///data/user/0/com.crat.keypoints/cache/Camera/3ecf6ca4-0381-4955-b62d-41d4a00461eb.mp4',
// };

export class SelectModal extends Component {
  render() {
    const {isVisible, closeModal, onUpdateList} = this.props;
    const {languages, categories} = this.props;
    return (
      <Modal
        isVisible={isVisible}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        animationOutTiming={500}
        backdropTransitionOutTiming={0}
        backdropColor={'black'}
        onRequestClose={closeModal}
        style={{
          flex: 1,
          margin: 10,
          borderRadius: 10,
        }}>
        <View
          style={{
            alignItems: 'center',
            alignItems: 'stretch',
            justifyContent: 'center',
          }}>
          <ChoiceComponent
            small={true}
            title={'Video Attributes'}
            languages={languages}
            categories={categories}
            onUpdateList={onUpdateList}
          />
          <TouchableOpacity onPress={closeModal}>
            <Text
              style={{
                backgroundColor: '#DDD',
                textAlign: 'center',
                padding: 10,
                marginHorizontal: 50,
                fontFamily: theme.fontFamily,
                fontWeight: 'bold',
                fontSize: 18,
                borderRadius: 10,
                marginTop: 5,
              }}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

class VideoEditor extends Component {
  state = {
    isSelectVisible: false,
    isPlayerVisible: false,
    title: {
      text: null,
      error: false,
    },
    url: null,

    languages: {
      itemList: [],
      error: null,
    },
    categories: {
      itemList: [],
      error: null,
    },
  };
  onUpdateList = (itemList, category) => {
    this.setState({
      [category]: {...this.state[category], itemList: itemList, error: false},
    });
  };

  update_options = () => {
    get_options().then(response => {
      let language_itemList = response.languages_options.map(item => {
        return {...item, selected: false};
      });
      let category_itemList = response.categories_options.map(item => {
        return {...item, selected: false};
      });
      this.setState({
        languages: {
          itemList: language_itemList,
          error: false,
        },
        categories: {
          itemList: category_itemList,
          error: false,
        },
      });
    });
  };

  closeSelectModal = () => {
    this.setState({isSelectVisible: false});
  };

  closeVideoModal = () => {
    this.setState({isPlayerVisible: false});
  };

  validateForm = () => {
    let isValid = true;
    const {title, languages, categories} = this.state;

    if (!title.text || title.text.length == 0) {
      isValid = false;
      this.setState({title: {...title, error: true}});
    }

    const lang_selected_list = languages.itemList.filter(
      item => item.selected === true,
    );
    const cat_selected_list = categories.itemList.filter(
      item => item.selected === true,
    );
    if (lang_selected_list.length == 0) {
      isValid = false;
      this.setState({languages: {...languages, error: true}});
    }
    if (cat_selected_list.length == 0) {
      isValid = false;
      this.setState({categories: {...categories, error: true}});
    }
    return isValid;
  };
  onPost = () => {
    if (this.validateForm()) {
      const {video_info} = this.props.route.params;
      const {title, languages, categories, url} = this.state;
      this.props.upload_video_data(
        this.props.Token,
        video_info,
        title.text,
        languages.itemList
          .filter(item => item.selected === true)
          .map(item => item.tag),
        categories.itemList
          .filter(item => item.selected === true)
          .map(item => item.tag),
        url,
        this.updateVideoList,
      );
      this.props.navigation.navigate('VideoDraft');
    }
  };
  onChangeTitle = text => {
    this.setState({title: {text: text, error: false}});
  };
  onKeyPress = e => {};

  addHashtag = () => {
    const title = this.state.title ? this.state.title : {text: null};
    let title_text = title.text;
    if (!title_text.endsWith('#')) {
      //   if (title.length > 0 && !title.endsWith(' ')) {
      //     title = `${title} `;
      //   }
      title_text = `${title_text}#`;
    }
    this.setState({title: {text: title_text, error: false}}, () => {});
  };

  componentDidMount() {
    this.update_options();
  }

  render_add() {
    return <AddIcon />;
  }
  render_chips(chipList) {
    return (
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
        {chipList.map(item => {
          return (
            <Chip
              key={item.id}
              avatar={
                <Image
                  source={{uri: item.thumbnail}}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'cover',
                    borderRadius: 5,
                  }}
                />
              }
              style={styles.selected_chip_style}
              textStyle={[styles.selected_chip_text_style]}>
              {chipHelperFun._getItemString(item.tag, maxChipItemDisplayLen)}
            </Chip>
          );
        })}
      </View>
    );
  }
  renderModal() {}
  render() {
    const {video_info} = this.props.route.params;
    const {title, languages, categories} = this.state;

    const lang_selected_list = languages.itemList.filter(
      item => item.selected === true,
    );
    const cat_selected_list = categories.itemList.filter(
      item => item.selected === true,
    );
    return video_info ? (
      <View style={styles.container}>
        <SelectModal
          isVisible={this.state.isSelectVisible}
          closeModal={this.closeSelectModal}
          onUpdateList={this.onUpdateList}
          position={'flex-end'}
          languages={languages}
          categories={categories}
        />
        <VideoPlayerModal
          video_info={video_info}
          isVisible={this.state.isPlayerVisible}
          closeModal={this.closeVideoModal}
        />
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => this.setState({isSelectVisible: true})}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor:
                    languages.error || categories.error ? 'red' : 'black',
                  margin: 5,
                  borderRadius: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: 5,
                  }}>
                  <LanguageIcon color={languages.error ? 'red' : 'black'} />
                  {lang_selected_list.length > 0
                    ? this.render_chips(lang_selected_list)
                    : this.render_add()}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: 5,
                  }}>
                  <CategoryIcon color={categories.error ? 'red' : 'black'} />
                  {cat_selected_list.length > 0
                    ? this.render_chips(cat_selected_list)
                    : this.render_add()}
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => this.setState({isPlayerVisible: true})}>
              <Image
                source={{uri: video_info.thumbnail_path}}
                style={{
                  height: 150,
                  width: 120,
                  marginRight: 10,
                  resizeMode: 'stretch',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TextInput
          ref={c => (this.textinput = c)}
          placeholder={'Add Title*'}
          placeholderTextColor={title.error ? 'red' : '#DDD'}
          multiline
          value={title.text}
          // numberOfLines={3}
          textAlignVertical="top"
          onChangeText={this.onChangeTitle}
          onKeyPress={this.onKeyPress}
          style={[
            styles.textinput_style,
            {
              flex: 1,
              padding: 0,
            },
          ]}>
          {/* <ParsedText
            style={{fontFamily: theme.fontFamily, fontSize: 20, lineHeight: 25}}
            parse={[
              {type: 'url', style: styles.url},
              {pattern: /#(\w+)/, style: styles.hashTag},
            ]}
            childrenProps={{allowFontScaling: false}}>
            {this.state.title}
          </ParsedText> */}
        </TextInput>
        <TextInput
          placeholder={'Add URL'}
          placeholderTextColor={'#DDD'}
          value={this.state.url}
          onChangeText={text => this.setState({url: text})}
          style={[styles.textinput_style, {fontSize: 15}]}
        />
        <View
          style={{
            // flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 10,
          }}>
          {/* <TouchableOpacity onPress={this.addHashtag}>
            <Text style={styles.hlink}>Add #Tags</Text>
          </TouchableOpacity> */}
          {/* <View></View> */}
          <TouchableOpacity onPress={this.onPost}>
            <Text style={styles.button_style}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : null;
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  video_player: {
    backgroundColor: 'white',
    width: winWidth,
    height: 1.25 * winWidth,
  },
  textinput_style: {
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    fontFamily: theme.fontFamily,
    fontSize: 20,
    lineHeight: 25,
  },
  hlink: {
    color: 'blue',
    fontFamily: theme.fontFamily,
    fontWeight: 'bold',
    margin: 10,
  },
  button: {
    fontFamily: theme.fontFamily,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: '#DDD',
    borderRadius: 20,
    fontSize: 16,
  },
  selected_chip_text_style: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
  chip_style: {
    backgroundColor: 'white',
    marginHorizontal: 2,
    marginVertical: 2,
    borderColor: 'black',
    borderWidth: 1,
  },
  selected_chip_style: {
    fontFamily: theme.fontFamily,
    fontSize: 12,
    backgroundColor: theme.logoColor,
    marginHorizontal: 2,
    marginVertical: 2,
    borderColor: 'black',
    borderWidth: 1,
  },
  url: {
    color: 'red',
    // textDecorationLine: 'underline',
  },
  hashTag: {
    color: 'blue',
  },
  button_style: {
    fontFamily: theme.fontFamily,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    backgroundColor: 'black',
    marginTop: 20,
    marginHorizontal: 25,
    padding: 5,
    borderRadius: 10,
  },
});

//make this component available to the app
import {connect} from 'react-redux';
import {setVideoList} from '../functions/CreateVideoFunctions';
const mapStateToProps = state => ({
  Token: state.AuthReducer.Token,
  video_list: state.CreateVideoReducer.video_list,
});

export default connect(mapStateToProps, {setVideoList, upload_video_data})(
  VideoEditor,
);
// export default VideoEditor;

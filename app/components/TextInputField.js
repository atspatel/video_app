import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {TextInput} from 'react-native-paper';

const  Defaulttheme = {
    colors:  
        {
            primary: 'blue'
        }
}


class TextInputField extends Component {
    render() {
        const {
            style,
            error,
            theme,
            mode,
            ...props
          } = this.props;
        
        const TextInputStyle = [
            style,
          ];

        
        return (
            <TextInput mode={mode? mode: 'outlined'}
                  theme={theme ? theme : Defaulttheme}
                  error={error}
                  style={TextInputStyle} 
                  {...props}
                  />
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    formButton:{
        backgroundColor: "lightblue",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 2,
        paddingHorizontal: 20,
        marginVertical: 5
    },
});


export default TextInputField;

import {
  IconCoreC,
  ViewCoreC,
  TextCoreC,
  ImageCoreC,
  InputCoreC,
} from '@lib/component'
import React from 'react'
import {Alert, StyleSheet, Text, View, ViewStyle} from 'react-native'

const screen_details = () => {
  return (
    <ViewCoreC
      backgroundColorReference={'white'}
      flex1
      justifyContent='center'
      midle>
      <ViewCoreC
        square={213}
        backgroundColorReference='aquamarine'
        borderBottomColor={'#000'}
        borderBottomWidth={1}
        style={{width: 300}}>
        <IconCoreC
          name='home'
          colorReference='rebeccapurple'
          type='Ionicons'
          size={23}
          style={{position: 'absolute', top: 90}}
        />
      </ViewCoreC>
      <TextCoreC
        backgroundColor='red'
        size={30}
        onPress={() => Alert.alert('123123')}>
        {'sa'}
      </TextCoreC>
      <ImageCoreC resizeMode='contain' width={200} borderRadius={100} />
      <InputCoreC   />
    </ViewCoreC>
  )
}
export default screen_details

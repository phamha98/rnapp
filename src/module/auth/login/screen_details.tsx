import {
  IconCoreC,
  ViewCoreC,
  TextCoreC,
  ImageCoreC,
  AvatarCoreC,
  ButtonBasic,
  InputCoreC,
} from '@libLavie/component'
import React, {useRef, useState} from 'react'
import {Alert, Button, StyleSheet, Text, View, ViewStyle} from 'react-native'

const screen_details = () => {
  const input: any = useRef()

  return (
    <ViewCoreC
      backgroundColorReference={'white'}
      flex1
      justifyContent='center'
      midle>
      <ButtonBasic onPress={() => input.current.check()} />
      <InputCoreC
        ref={input}
        placeholder='nhap tai day'
        placeholderTextColor='red'
      />
    </ViewCoreC>
  )
}
export default screen_details

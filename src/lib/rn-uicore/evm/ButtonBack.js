import {IconCore, TouchableCore} from '@lib/rn-ui-component'
import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {COLOR, ICON} from '@lib/rn-ui-component'

const diameter = 40
export default function ButtonBack ({onPress, color, ...rest}) {
  return (
    <TouchableCore
      onPress={onPress}
      width={diameter}
      height={diameter}
      borderRadius={diameter / 2}
      backgroundColor='#DDDDDD9A'
      midle
      {...rest}>
      <IconCore name={ICON.chevron_back_outline} color={color} size={23} />
    </TouchableCore>
  )
}

const styles = StyleSheet.create({})

import {TextCore, TouchableCore} from '@lib/rn-ui-component'
import {stylesGlobal} from '@utils'
import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {COLOR} from '@lib/rn-ui-component'
import {FSIZE} from '@lib/rn-ui-component'

export default function ButtonEvm ({
  onPress,
  title,
  style = stylesGlobal.shadow2,
  styleTitle,
  height = 50,
  ...rest
}) {
  return (
    <TouchableCore
      onPress={onPress}
      width={100}
      height={height}
      borderRadius={height / 2}
      bacgroundColor={COLOR.green1}
      midle
      style={style}
      {...rest}>
      <TextCore color='#fff' size={FSIZE.fs14} bold style={styleTitle}>
        {title}
      </TextCore>
    </TouchableCore>
  )
}

const styles = StyleSheet.create({})

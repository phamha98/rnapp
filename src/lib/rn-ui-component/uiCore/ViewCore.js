import React from 'react'
import {StyleSheet, Text, View} from 'react-native'

export default function ViewCore ({
  children,
  width,
  height,
  backgroundColor,
  alignItems,
  justifyContent,
  midle,
  row,
  style,
  flex1,
  borderRadius,
  spaceBetween,
  centerHorizontal,
  ...rest
}) {
  const styleAdd = [
    row && {flexDirection: 'row'},
    alignItems && {alignItems: 'center'},
    justifyContent && {justifyContent: 'center'},
    midle && {alignItems: 'center', justifyContent: 'center'},
    spaceBetween && {justifyContent: 'space-between'},
    centerHorizontal && {alignItems: 'center', justifyContent: 'space-between'},
    flex1 && {flex: 1},
    {
      width: width,
      height: height,
      backgroundColor: backgroundColor,
      borderRadius: borderRadius,

      ...rest,
    },
  ]
  return <View style={[styleAdd, style]}>{children}</View>
}

const styles = StyleSheet.create({
  s: {
    justifyContent: 'space-between',
  },
})

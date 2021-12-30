import React from 'react'
import {StyleSheet, Text, View} from 'react-native'

export default function TextCore ({
  children,
  color,
  size,
  backgroundColor,
  lower,
  UPPER,
  style,
  bold,
  italic,
  onPress,
  center,
  numberOfLines,
  ...rest
}) {
  const Children = () => {
    if (UPPER) return `${children}`.toUpperCase()
    if (lower) return `${children}`.toLowerCase()
    return children
  }
  const styleC = [
    bold && {fontWeight: 'bold'},
    italic && {fontStyle: 'italic'},
    center && {textAlign: 'center'},
  ]
  return (
    <Text
      onPress={onPress}
      numberOfLines={numberOfLines}
      style={[
        {
          fontSize: size,
          color: color,
          backgroundColor: backgroundColor,
          ...rest,
        },
        style,
        styleC,
      ]}>
      {Children()}
    </Text>
  )
}
TextCore.defaultProps = {
  children: null,
  color: '#000',
  size: 14,
  backgroundColor: null,
  lower: false,
  UPPER: false,
  onPress: null,
  numberOfLines: null,
}
const styles = StyleSheet.create({
  s: {
    justifyContent: 'space-between',
    fontWeight: 'bold',
  },
})

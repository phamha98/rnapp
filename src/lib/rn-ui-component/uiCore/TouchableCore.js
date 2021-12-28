import React from 'react'
import {TouchableOpacity} from 'react-native'
 
export default function TouchableCore ({
  children,
  bacgroundColor,
  width,
  height,
  onPress,
  row,
  alignItems,
  justifyContent,
  midle,
  spaceBetween,
  centerHorizontal,
  style,
  activeOpacity,
  disabled,
  ...rest
}) {
  const styleAdd = [
    row && {flexDirection: 'row'},
    alignItems && {alignItems: 'center'},
    justifyContent && {justifyContent: 'center'},
    midle && {alignItems: 'center', justifyContent: 'center'},
    spaceBetween && {justifyContent: 'space-between'},
    centerHorizontal && {alignItems: 'center', justifyContent: 'space-between'},
    style,
  ]
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          width: width,
          height: height,
          backgroundColor: bacgroundColor,
          ...rest,
        },
        styleAdd,
      ]}>
      {children}
    </TouchableOpacity>
  )
}
TouchableCore.defaultProps = {}

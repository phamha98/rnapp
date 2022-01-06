import React from 'react'
import {StyleSheet, Text, TouchableOpacity, ViewStyle} from 'react-native'
import {rnColor} from './res/color'
interface PropsViewCore extends ViewStyle {
  children?: React.ReactNode
  width?: number | string
  height?: number | string
  square?: number
  midle?: boolean
  row?: boolean
  style?: ViewStyle
  flex1?: boolean
  centerHorizontal?: boolean
  backgroundColorReference?: rnColor
  backgroundColor?: rnColor | string
  flex?: number
  activeOpacity?: number
}
const ViewCoreC: React.FC<PropsViewCore> = props => {
  const styleProps: Array<any> = [
    props.midle && {alignItems: 'center', justifyContent: 'center'},
    props.flex1 && {flex: 1},
    props.row && {flexDirection: 'row'},
    props.square && {width: props.square, height: props.square},
    props.midle && {alignItems: 'center', justifyContent: 'center'},
    props.centerHorizontal && {
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    {
      backgroundColor: props.backgroundColor
        ? props.backgroundColor
        : props.backgroundColorReference,
    },
  ]
  return (
    <TouchableOpacity
      activeOpacity={props.activeOpacity}
      style={[styleProps, {...props}, props.style]}>
      {props.children}
    </TouchableOpacity>
  )
}

export default ViewCoreC

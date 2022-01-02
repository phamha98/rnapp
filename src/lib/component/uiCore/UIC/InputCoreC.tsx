import React, {useState, forwardRef, useImperativeHandle,Ref} from 'react'
import {
  TextStyle,
  ViewStyle,
  TextProps,
  ColorValue,
  TextInput,
} from 'react-native'
import {StyleSheet, Text, View} from 'react-native'
import {rnColor} from './color'
interface InputProps {
  // style?: TextStyle
  // colorReference?: rnColor
  // backgroundColor?: rnColor | string
  // color?: string | rnColor | ColorValue

  // lower?: boolean
  // bold?: boolean | number
  // center?: boolean
  // italic?: boolean
  // size?: number
  valueInit?: string | undefined
}

 

//React.ForwardRefRenderFunction<InputHandle, InputProps> = (
const InputCoreC=forwardRef((props: {name: string},ref: Ref<{SayHi:Function}>)=> {
  const [value1, setValue1] = useState('')
  useImperativeHandle(ref, () => ({ SayHi }));
  function SayHi() {console.log("Saying hello from: "); }
  return (
    <TextInput
      value={value1}
      onChangeText={v => setValue1(v)}
      // {...props}
      // style={[styleProps, props.style]}
    />
  )
})

export default InputCoreC

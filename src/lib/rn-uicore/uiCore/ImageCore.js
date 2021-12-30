import React from 'react'
import {Image} from 'react-native'

export default function ImageCore ({
  source,
  width,
  height,
  resizeMode,
  style,
  ...rest
}) {
  if (!source || source === null || source === undefined) return null
  return (
    <Image
      source={source}
      style={[
        {width: width, height: height, resizeMode: resizeMode, ...rest},
        style,
      ]}
    />
  )
}

ImageCore.defaultProps = {
  source: null,
  width: 100,
  height: 100,
  resizeMode: 'contain',
}

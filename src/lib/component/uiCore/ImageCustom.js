import {ViewCore,COLOR} from './index'
import React, {useState, useRef, useEffect} from 'react'
import {ActivityIndicator, Image} from 'react-native'
export default function ImageCustom ({
  source,
  width,
  height,
  resizeMode = 'contain',
  style,
  ...rest
}) {
  if (!source || source === null || source === undefined) return null
  const [load, setLoad] = useState(true)
  const [isErr, setIsErr] = useState(false)
  const refImg = useRef()
  const _onLoadStart = () => {
    setLoad(true)
    refImg.current = setTimeout(() => {
      setLoad(false)
    }, 3000)
  }
  const _onError = () => {
    console.log('error')
    setIsErr(true)
  }
  useEffect(() => {
    return () => {
      clearTimeout(refImg.current)
    }
  }, [])
  return (
    <ViewCore midle>
      <Image
        source={isErr ? require('@images/noimage.jpg') : source}
        style={[{width: width, height: height, resizeMode: resizeMode}, style]}
        {...rest}
        onLoadStart={_onLoadStart}
        onLoadEnd={() => setLoad(false)}
        onError={_onError}
      />
      {load && (
        <ActivityIndicator
          color={COLOR.green1}
          size={20}
          style={{position: 'absolute'}}
        />
      )}
    </ViewCore>
  )
}

ImageCustom.defaultProps = {
  source: null,
  width: 100,
  height: 100,
  resizeMode: 'contain',
}

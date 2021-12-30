import {ImageCore, ViewCore} from '../../uiCore'
import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {isEmpty} from 'underscore'
const SIZEA = {
  d1: 60,
}
export default function AvatartCore ({
  source,
  size,
  gender = 0,
  style,
  ...rest
}) {
  if (isEmpty(source))
    return (
      <ViewCore backgroundColor='#fff' style={[styles.avatar, style]}>
        {gender === 0 && (
          <ImageCore
            source={require('./man.png')}
            style={styles.avatar}
            {...rest}
          />
        )}
        {gender === 1 && (
          <ImageCore
            source={require('./woman.jpg')}
            style={styles.avatar}
            {...rest}
          />
        )}
      </ViewCore>
    )
  return (
    <ViewCore style={[styles.avatar, style]}>
      <ImageCore
        style={styles.avatar}
        source={require('./man.png')}
        {...rest}
      />
    </ViewCore>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: SIZEA.d1,
    height: SIZEA.d1,
    borderRadius: SIZEA.d1,
    overflow: 'hidden',
  },
  s: {
    overflow: 'hidden',
  },
})

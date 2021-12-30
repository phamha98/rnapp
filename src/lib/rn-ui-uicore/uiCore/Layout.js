import React from 'react'
import {StyleSheet, View, StatusBar, SafeAreaView} from 'react-native'
// import SafeAreaView from 'react-native-safe-area-view'
export default function Layout ({children, ...rest}) {
  // console.log('1.1', StatusBar.currentHeight)
  return (
    <SafeAreaView
      forceInset={{top: 'never'}}
      style={[{flex: 1, backgroundColor: '#fff'}, {...rest}]}>
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})

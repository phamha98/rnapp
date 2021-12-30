import React, {useEffect} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {navigationRef, isReadyRef} from './rootNavigation'
import SplashScreen from 'react-native-splash-screen'
// import {useSelector} from 'react-redux'
import Auth from '@screen/auth'
// import App from '@screen/app'
// import {log} from '@utils'
export default function Navigation () {
//   const {isSigned} = useSelector(state => state.GlobalAuth)
//   log('isSigned', isSigned)
  useEffect(() => {
    SplashScreen.hide()
  }, [])
  return (
    <NavigationContainer ref={navigationRef} independent={true}>
      {/* {isSigned ? <App /> : <Auth />} */}
      <Auth/>
    </NavigationContainer>
  )
}

import {Alert} from 'react-native'
import {AlertMessage} from '@lib'
import { COLOR } from 'src/res'
/**
 *
 * @param {String} value
 * @returns
 */
export const checkValidatePhone = value => {
  const checkPhone = /((09|03|07|08|05)+([0-9]{8})\b)/g
  if (!checkPhone.test(value)) return false
  return true
}
/**
 *
 * @param {String} value
 * @returns
 */
export const checkValidatePassword = value => {
  const checkPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/
  if (!checkPass.test(value)) return false
  return true
}
/**
 *
 * @param {String} value
 * @returns
 */
export const checkValidateEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
export const ToastNull = title => {
  return AlertMessage.show({
    title: 'Cảnh báo',
    message: title + ' không được để trống !',
    buttons: [
      {
        name: 'Đóng',
        action: () => {}, //navigate('home')
        color:'#000'
      },
      {
        name: 'Nhập thông tin',
        delay: 0,
        color:COLOR.yesAlert,
        action: () => {},
      },
    ],
  })
}

export const ToastInvalid = title => {
  Alert.alert('Cảnh báo', title, [
    {
      text: 'Hủy',
      style: 'cancel',
    },
    {text: 'Đồng ý', onPress: () => console.log('OK Pressed')},
  ])
}

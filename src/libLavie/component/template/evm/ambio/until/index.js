import {Alert, AppState, Linking, NativeModules, PermissionsAndroid, Platform, Vibration} from 'react-native';
import {isArray, has, isString, groupBy, values, sortBy, isObject, isEmpty, isFunction} from 'underscore';
import {getParamDefault} from '../deviceInfo';
import {log, logInfo} from '../debug';
import {getBy, getUserInfo} from '@serviceUser';
import {set as setToken, get as getToken} from '../models/token';
import {set as setMqtt} from '../models/mqttInfo';
import {sleep, toast} from '../funcUtil';
import {pubDevice, pubProccesser} from '../mqttUtil';
import NetInfo from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';
import {getHomeId} from "@service/app/appStore";
import {set as setTokenPush} from "@model/tokenPush";
import {
    FlashMessage,
    getStatusBarHeight,
    useEffect,
    useState,
    AlertMessage,
    showHandleLoading,
    hideHandleLoading
} from '@uiCore';
import WifiAndroid from 'react-native-android-wifi';
import {request, PERMISSIONS, RESULTS, checkNotifications} from 'react-native-permissions';
import {goBack, navigate} from '@lib/rootNavigation';
import {AppConfig} from '@lib/config';
import {getDeviceStatus} from "@serviceDeviceLWT";
import {getStateInfo} from "@serviceDeviceState";
import {getDevicePhysicalInfo} from "@serviceDevicePhysical";
import {getDeviceInfo} from "@serviceDevice";
// import { setGlobalState } from '../store';
// import { LOCATION_CHANGE } from '../store/constant';

export * from './date';
export const isNumeric = (num) => !isNaN(parseInt(num));

/**
 *
 * @param {Number} value
 * @param {Number} num
 */
export function round(value, num) {
    return Math.round(value * Math.pow(10, num)) / Math.pow(10, num);
}

/**
 *
 * @param {Array<String>} props
 * @param {Object} data
 */
export function hasSomeProps(props, data) {
    let result = true;
    if (isArray(props)) {
        for (let i = 0; i < props.length; i++) {
            if (!has(data, props[i])) {
                result = false;
                break;
            }
        }
    } else {
        result = false;
    }
    return result;
}

/**
 *
 * @param {String} field
 * @param {Object} data
 */
export function sort(field, data) {
    if (isString(field) && isArray(data)) {
        const callBack = (a, b) =>
            a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
        const result = data.sort(callBack);
        return result;
    }
    return false;
}

/**
 *
 * @param {String} input
 * @param {String} type
 */
export function getEmptyError(input, type) {
    //if (__DEV__) return null;
    if (!isString(input)) return `${type} kh??ng h???p l???`;
    let inputCheck = input.trim();
    if (isEmpty(inputCheck)) return `Vui l??ng nh???p ${type}`;
    return null;
}

/**
 *
 * @param {String} input
 * @param {String} diff
 */
export function getPhoneError(input, diff = '') {
    //if (__DEV__) return null;
    if (!isString(input) || input.includes('.')) return 'S??? ??i???n tho???i kh??ng h???p l???';
    let inputCheck = input.trim();
    if (isEmpty(inputCheck)) return 'Vui l??ng nh???p s??? ??i???n tho???i';
    let isPhone = inputCheck.substr(0, 2) == '84' || inputCheck.substr(0, 3) == '+84' || inputCheck.substr(0, 1) == 0;
    if (!isPhone || inputCheck.length > 15 || inputCheck.length < 10) return 'S??? ??i???n tho???i kh??ng h???p l???';
    let re = /^[+0-9]*$/;

    if (
        !re.test(inputCheck) ||
        // inputCheck == '0987654321' ||
        // inputCheck == '0123456789' ||
        inputCheck == diff ||
        !isNumeric(inputCheck)
    ) {
        return 'S??? ??i???n tho???i kh??ng h???p l???';
    }
    return null;
}

/**
 *
 * @param {String} input
 */
export function getNameError(input) {
    //if (__DEV__) return null;
    if (!isString(input)) return 'T??n kh??ng h???p l???';
    let inputCheck = input.trim();
    if (isEmpty(inputCheck)) return `Vui l??ng nh???p t??n`;
    if (inputCheck.length < 1 || inputCheck.length > 30) {
        return `T??n ch???a ??t nh???t 1 k?? t??? v?? kh??ng qu?? 30 k?? t???`;
    }
    return null;
}

/**
 *
 * @param {String} input
 * @param {String} type
 */
export function getPasswordError(input, type) {
    if (!isString(input)) return 'M???t kh???u kh??ng h???p l???';
    let inputCheck = input.trim();
    if (isEmpty(inputCheck)) return 'Vui l??ng nh???p m???t kh???u';
    if (inputCheck.length < 6 || inputCheck.length > 15) {
        return ("M???t kh???u t???i thi???u 6 k?? t??? v?? t???i ??a 15 k?? t???");
    } else if (inputCheck.search(/\d/) === -1) {
        return ("M???t kh???u ph???i c?? k?? t??? s???");
    } else if (inputCheck.search(/[a-zA-Z]/) === -1) {
        return ("M???t kh???u ph???i c?? k?? t??? ch???");
    } else {
        return null;
    }
}

/**
 *
 * @param {String} input
 */
export function getCodeError(input) {
    //if (__DEV__) return null;
    if (!isString(input)) return 'M?? kh??ng h???p l???';
    let inputCheck = input.trim();
    if (isEmpty(inputCheck)) return 'Vui l??ng nh???p m?? x??c nh???n';
    else if (!inputCheck.length == 6) return 'M?? x??c nh???n kh??ng h???p l???';
    return null;
}

/**
 *
 * @param {Object} data
 */
export async function saveToken(data) {
    if (
        typeof data == 'object' &&
        has(data, 'access_token') &&
        has(data, 'mqtt_user', data) &&
        has(data, 'mqtt_pass', data)
    ) {
        await setToken(data.access_token);
        await setMqtt(data.mqtt_user, data.mqtt_pass);
        return true;
    } else {
        return false;
    }
}

/**
 *
 * @param {Promise} promise
 * @param {Number} timeout
 * @param {String} error
 */
export function timeoutPromise(promise, timeout, error) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(error);
        }, timeout);
        promise.then(resolve, reject);
    });
}

/**
 *
 * @param {String} uri
 * @param {String} method
 * @param {Object} data
 * @param {String} exceptInits
 * @param {Boolean} isFormData
 */
export async function fetcher(uri, method, data, exceptInits, isFormData = false) {
    try {
        const {isConnected} = await NetInfo.fetch();
        const access_token = await getToken();
        if (isConnected) {
            return new Promise(async (resolve, reject) => {
                var init = {
                    method: method,
                    headers: {
                        'Content-Type': isFormData
                            ? 'multipart/form-data'
                            : 'application/json',
                        Authorization: `Bearer ${access_token}`,
                    },
                };

                var initParams = await getParamDefault();

                if (exceptInits && hasSomeProps(exceptInits, initParams))
                    await exceptInits.map(async (item) => {
                        log('except ' + item + ' value ' + initParams[item]);
                        await delete initParams[item];
                    });

                if (isObject(data)) {
                    init = await {
                        ...init,
                        body: isFormData ? data : JSON.stringify({...data, ...initParams}),
                    };
                    log('fetcher ', uri, {...data, ...initParams});
                }
                if (isString(data)) {
                    init = {
                        ...init,
                        body: data,
                    };
                    log('fetcher ', uri, data);
                }
                await fetch(uri, {...init})
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        log('fetcher response ', data);
                        resolve(data);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
            // return timeoutPromise(promise, timeout, 'Kh??ng th??? k???t n???i t???i m??y ch???');
        } else toast('Vui l??ng k???t n???i internet!');
    } catch (error) {
        log(error.message);
    }
}

export function openSettingWifi() {
    switch (Platform.OS) {
        case 'android':
            NativeModules.OpenSettings.openWifiSettings((data) => {
            });
            break;
        case 'ios':
            let url = 'App-Prefs:root=WIFI';
            Linking.canOpenURL(url)
                .then((supported) => {
                    if (!supported) {
                        NativeModules.OpenSettings.openSettings((data) => {
                        });
                    } else {
                        return Linking.openURL(url);
                    }
                })
                .catch((err) => log('open fail open setting', err.message));
            break;
    }
    return;
}

/**
 *
 * @param {String} rssiCheck
 */
export function checkNet(rssiCheck) {
    if (!isNumeric(rssiCheck)) return 'Kh??ng x??c ?????nh';
    const rssi = Number(rssiCheck);
    if (rssi < 0) {
        if (rssi >= -50) {
            return "R???t t???t";
        } else if (rssi >= -60) {
            return "T???t";
        } else if (rssi >= -70) {
            return "Trung b??nh";
        } else {
            return "Y???u";
        }
    } else {
        if (rssi < 10) {
            return 'R???t y???u';
        } else if (10 <= rssi && rssi <= 15) {
            return 'Y???u';
        } else if (16 <= rssi && rssi <= 20) {
            return 'Trung b??nh';
        } else if (21 <= rssi && rssi <= 26) {
            return 'Kh??';
        } else if (27 <= rssi && rssi <= 30) {
            return 'T???t';
        } else {
            return 'R???t t???t';
        }
    }
}

export async function checkLocationPermissionAndroid() {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: 'Th??ng b??o',
            message:
                'Ch??ng t??i c???n quy???n truy c???p v??? tr?? c???a b???n ????? l???y t??n Wi-Fi, ????y l?? ch??nh s??ch m???i. B???n vui l??ng c???p quy???n truy c???p ????? ti???p t???c',
        },
    );
    if (granted == PermissionsAndroid.RESULTS.GRANTED) {
        return true;
    }
    // setGlobalState(LOCATION_CHANGE, false)
    return false;
}

export async function checkLocationPermissionIos() {
    const res = await Permissions.check(PERMISSIONS.IOS.LOCATION_ALWAYS);
    if (res === RESULTS.GRANTED) {
        return true;
    } else if (res === RESULTS.DENIED) {
        const res2 = await Permissions.request(PERMISSIONS.IOS.LOCATION_ALWAYS, {
            title: 'Th???ng b??o',
            message:
                'Ch??ng t??i c???n quy???n truy c???p v??? tr?? c???a b???n ????? l???y t??n Wi-Fi, ????y l?? ch??nh s??ch m???i. B???n vui l??ng c???p quy???n truy c???p ????? ti???p t???c',
        });
        if (res2 === RESULTS.GRANTED) {
            return true;
        }
        // setGlobalState(LOCATION_CHANGE, false)
        return false;
    }
}

export function checkCameraPermission() {
    return new Promise(async resolve => {
        try {
            let granted = await request(
                Platform.select({
                    android: PERMISSIONS.ANDROID.CAMERA,
                    ios: PERMISSIONS.IOS.CAMERA,
                })
            );
            let rs = granted === RESULTS.GRANTED;
            log('checkCameraPermission', rs);
            alertPermission(rs, 'Camera', 'Vui l??ng c???p quy???n truy c???p camera c???a b???n ????? s??? d???ng ch???c n??ng n??y!', goBack, openSettingApp);
            resolve(rs);
        } catch (err) {
            log(err);
            resolve(false);
        }
    });
}

export function checkLocationPermission() {
    return new Promise(async (resolve, reject) => {
        try {
            let rs = false;
            switch (Platform.OS) {
                case 'android':
                    rs = await checkLocationPermissionAndroid();
                    resolve(rs);
                    break;
                case 'ios':
                    // rs = await checkLocationPermissionIos();
                    resolve(true); // ios error default true
                    break;
                default:
                    resolve(true);
                    break;
            }
        } catch (err) {
            log(err);
            resolve(false);
        }
    });
}

/**
 *
 * @param {String} action
 * @param {Object} params
 */
export function pubProc(action, params) {
    return new Promise((resolve, reject) => {
        pubProccesser(
            action,
            params,
            (response) => {
                if (has(response, 'status') && response.status == 'success') {
                    resolve(response);
                    return response;
                } else {
                    resolve(false);
                    return false;
                }
            },
            10000,
        );
    });
}

/**
 *
 * @param {String} action
 * @param {Object} params
 * @param {Function} method
 */
export function fetchProc(action, params, method = 'POST') {

    return new Promise(async (resolve, reject) => {
        let homeID = getHomeId();
        if (!homeID) resolve(false);
        let data = {
            action,
            data: isObject(params) ? JSON.stringify({home_id: homeID, ...params}) : isString(params) ? JSON.stringify(params) : '',
            type: 'farm',
            name: 'ambio',
            home_id: homeID,
        };
        let response = await fetcher('https://api.hongphuc.net/app', method, data, [
            'app_key',
        ]);
        log('fetchProc ' + action, response);
        if (response) {
            await resolve(response);
            return response;
        } else {
            await resolve(false);
            return false;
        }
    });
}

/**
 *
 * @param {String} deviceID
 * @param {String} cmd
 * @param {String} mess
 * @param {String} actionRs
 */
export function pubDev(deviceID, cmd, mess, actionRs = false) {
    return new Promise((resolve, reject) => {
        pubDevice(
            deviceID,
            cmd,
            mess,
            (response) => {
                if (response) {
                    resolve(response);
                    return response;
                } else {
                    resolve(false);
                    return false;
                }
            },
            10000,
            actionRs,
        );
    });
}

/**
 *
 * @param {Array} items
 * @param {Number} size
 */
export function partition(items, size) {
    let result = groupBy(items, function (item, i) {
        return Math.floor(i / size);
    });
    return values(result);
}

/**
 *
 * @param {Array<Object>} data
 * @param {String} byKey
 */
export async function sortAndClassify(data, byKey = 'name') {
    let result = {};
    // follow name
    await sortBy(data, 'name').map(async (item, index) => {
        let key =
            (await has(item, byKey)) &&
            typeof item[byKey] == 'string' &&
            !isNumeric(item[byKey])
                ? await `${item[byKey]}`.trim().toUpperCase().slice(0, 1)
                : `${item[byKey]}`.trim();
        result[key] = has(result, key) ? [...result[key], item] : [item];
    });
    return result;
}

/**
 *
 * @param {String} error
 */
export function toastError(error) {
    return false;
}

/**
 *
 * @param {Function} ok
 * @param {Function} no
 */
export function warningAlert(ok = () => {
}, no = () => {
}, title = false, mess = false, text_ok = "C??", text_no = "Kh??ng") {
    let config = [
        {
            text: text_no,
            onPress: no,
            style: 'cancel',
        },
        {
            text: text_ok,
            onPress: ok,
        },
    ];
    if (no === false) config.splice(0, 1);
    return Alert.alert(
        title ? title : 'C???nh b??o',
        mess ? mess : 'B???n c?? mu???n th???c hi???n thao t??c n??y? Sau khi th???c hi???n s??? kh??ng th??? ho??n t??c.',
        config
        ,
        {cancelable: false},
    );
}

/**
 *
 * @param {String} message
 */
export function alert(message) {
    return Alert.alert('Th??ng b??o', message, [], {cancelable: true});
}

export function vibrationPhone() {
    return Vibration.vibrate();
}

export function convertMessDevice(mess) {
    return isObject(mess) ? {...mess, by: getBy()} : mess;
}

export async function requestUserPermission() {
    let settings = await messaging().requestPermission();
    if (settings) {
        let fcmToken = await messaging().getToken();
        if (fcmToken) {
            return fcmToken;
        }
    }
}

export async function sendFCMToken() {
    let fcmToken = await requestUserPermission();
    if (fcmToken) {
        messaging().subscribeToTopic(AppConfig.dist.toUpperCase()+'_ALL').then(() => logInfo('Subscribed FCM to topic! '+AppConfig.dist.toUpperCase()+'_ALL'));
        setTokenPush(fcmToken);
        await pubProc('log_token', {
            bundle_id: AppConfig.bundle_id,
            platform: Platform.OS === 'ios' ? 'ios' : 'android',
            token: fcmToken,
        });
    }
}

export function developing() {
    return alert('Phi??n b???n ch??a h??? tr??? t??nh n??ng n??y, ch??ng t??i s??? c???p nh???t t??nh n??ng nhanh nh???t');
}

export async function getWifiSSID() {
    try {
        return new Promise(async function (resolve, reject) {
            if (Platform.OS === 'android') {
                WifiAndroid.getSSID((ssid) => {
                    if (ssid) resolve(ssid);
                    else resolve('')
                })
            } else if (Platform.OS == 'ios') {
                const Network = NativeModules.Network;
                Network.getSSID().then(async (ssid) => {
                    if (ssid) resolve(ssid);
                    else resolve('')
                }).catch((error) => {
                    resolve('');
                });
            }
        });
    } catch (error) {
        log(error.message)
    }
};

/**
 *
 * @param {String} string
 */
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 *
 * @param {String} command
 * @param {String} state
 */

export function getCommandName(command, state) {
    switch (command) {
        case 'contact':
            return state ? '????ng' : 'M???';
        case 'occupancy':
            return state ? 'C?? chuy???n ?????ng' : 'Kh??ng chuy???n ?????ng';
    }
}

/**
 *
 * @param {String} type
 * @param {String} title
 * @param {String} description
 * @param {Boolean} autoHide
 * @param {Function} onShow
 * @param {Function} onHide
 * @param {Function} onPress
 */

export function showFlashMessage(type, title = "Th??ng b??o", description, autoHide = true, onShow = () => {
}, onHide = () => {
}, onPress = () => {
}) {
    return FlashMessage && FlashMessage.show({
        type,
        position: 'top',
        text1: title,
        text2: description,
        visibilityTime: 4000,
        autoHide,
        topOffset: 10,
        bottomOffset: 30,
        onShow,
        onHide,
        onPress
    });
}

/**
 *
 * @param {String} title
 * @param {String} description
 */

export function showFlashMessageError(description, title = "Th??ng b??o") {
    showFlashMessage("error", title, description);
}

/**
 *
 * @param {String} title
 * @param {String} description
 */

export function showFlashMessageSuccess(description, title = "Th??ng b??o") {
    showFlashMessage("success", title, description);
}

/**
 *
 * @param {Function} handler
 */
export function useAppState(handler) {
    const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);
    const _handleAppStateChange = async (nextAppState) => {
        await setAppStateVisible(nextAppState);
        isFunction(handler) && handler(nextAppState);
    };

    useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange);

        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
        };
    }, []);

    return appStateVisible === "unknown" ? "active" : appStateVisible; // if unknown default active
}

export function alertMessage(options) {
    log('alert message showing');
    return AlertMessage.show(options);
}

export function hideAlertMessage() {
    log('alert message hiding');
    return AlertMessage.hide();
}

function alertPermission(rs, title, message, cancel, ok) {
    if(rs) hideAlertMessage();
    else alertMessage({
        title,
        message,
        buttons: [
            {action: cancel, name: 'Kh??ng', color: 'red'},
            {action: ok, name: 'C???p quy???n'},
        ],
    });
}

function openSettingApp() {
    return Linking.openSettings();
}

export function checkContactPermission() {
    return new Promise(async resolve => {
        try {
            const granted = await request(
                Platform.select({
                    android: PERMISSIONS.ANDROID.READ_CONTACTS,
                    ios: PERMISSIONS.IOS.CONTACTS,
                }));
            let rs = granted === RESULTS.GRANTED;
            log('checkContactPermission', rs);
            alertPermission(rs, 'Danh b???', 'Vui l??ng c???p quy???n truy c???p danh b??? c???a b???n ????? s??? d???ng ch???c n??ng n??y!', goBack, openSettingApp);
            resolve(rs);
        } catch (err) {
            console.warn(err.message);
            resolve(false);
        }
    });
}

/**
 *
 * @param {String} url
 */
export async function openLink (url) {
    try{
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            Linking.openURL(url);
        }else {
            alertMessage({
                title:'Truy c???p li??n k???t',
                message :'Truy c???p li??n k???t th???t b???i, vui l??ng ki???m tra li??n k???t!',
                buttons : [{name:'???? hi???u'}]
            })
        }
    }catch(error) {
        log(error)
    }
}

/**
 *
 * @param {Number} gam
 */
export function gamToKg (gam) {
    return `${round(parseInt(gam)/ 1000, 1)}`
}

/**
 *
 * @param {Date} from
 * @param {Date} to
 */
export function checkTime(from, to) {
    let fts = from.getTime();
    let tts = to.getTime();
    if (tts - fts < 0) return false;
    let ds = round((tts - fts) / (1000 * 3600 * 24), 0);
    let t = ds >= 360 * 3 ? 'year' : ds >= 31 ? 'month' : ds <= 0 ? 'hour' : 'day';
    log('check time', ds, t);
    return t;
}

/**
 *updateDeviceState
 * @param {String} deviceID
 * @param {String} state
 * @param {Object} data
 * @param type
 */
export async function updateDeviceState(deviceID, state, data, type) {
    const lwt = getDeviceStatus(deviceID);
    const cf = getStateInfo(deviceID, "cf");
    const {device_name} = getDevicePhysicalInfo(deviceID);
    log('updateDeviceState', {lwt, cf});
    if (!lwt) {
        showFlashMessageError(`Thi???t b??? ${device_name} ??ang ngo???i tuy???n, vui l??ng ki???m tra k???t n???i internet, ngu???n ??i???n!`);
        return false;
    }
    if (cf && has(cf, 'fm') && cf['fm'] === 'mt' && type === 'feed1') {
        alertMessage({
            title: 'Ch??? ????? b???o tr??',
            message: 'Thi???t b??? ??ang ??? ch??? ????? b???o tr??, vui l??ng chuy???n ch??? ????? ????? ti???p t???c cho ??n',
            buttons: [
                {name: 'H???y'},
                {name: 'Thi???t l???p', delay: 0, color: '#47AA12', action: () => navigate('device_mode', {deviceID})},
            ],
        });
        return false;
    }
    let messFail = failMessage(type);
    return await sendDeviceState(deviceID, state, data, messFail);
}

const failMessage = type => {
    switch (type) {
        case 'ra':
            return 'C???p nh???t b??n k??nh cho ??n th???t b???i, b???n c?? mu???n th??? l???i?';
        case 'ps':
            return 'C???p nh???t t???c ????? c???p th???c ??n th???t b???i, b???n c?? mu???n th??? l???i?';
        case 'ct0':
            return 'T???t th??ng b??o khi b??? k???t th???c ??n th???t b???i, b???n c?? mu???n th??? l???i?';
        case 'ct1':
            return 'B???t th??ng b??o khi b??? k???t th???c ??n th???t b???i, b???n c?? mu???n th??? l???i?';
        case 'ct2':
            return 'B???t y??u c???u t???t khi b??? k???t th???c ??n 8 l???n li??n t???c th???t b???i, b???n c?? mu???n th??? l???i?';
        case 'fz':
            return 'C???p nh???t k??ch th?????c th???c ??n cho ??n th???t b???i, b???n c?? mu???n th??? l???i?';
        case 'feed3':
            return 'T???t thi???t b??? th???t b???i, b???n c?? mu???n th??? l???i?';
        case 'feed1':
            return 'Ch???y thi???t b??? th???t b???i, b???n c?? mu???n th??? l???i?';
        case 'fs':
            return '??i???u ch???nh t???c ????? th???t b???i, b???n c?? mu???n th??? l???i?';
        case 'fm':
            return 'Thay ?????i ch??? ????? th???t b???i, b???n c?? mu???n th??? l???i?';
        case 'ec0':
            return 'B???t ch???c n??ng t???t m??y khi h???t th???c ??n, b???n c?? mu???n th??? l???i?';
        case 'ec1':
            return 'T???t ch???c n??ng t???t m??y khi h???t th???c ??n, b???n c?? mu???n th??? l???i?';
        case 'et':
            return 'Thi???t l???p th???i gian k???t th??c, b???n c?? mu???n th??? l???i?';
        case 'zerocalib':
            return '????a c??n v??? kh??ng th???t b???i, b???n c?? mu???n th??? l???i?';
        case 'basiccalib':
            return 'Hi???u ch???nh c??n c?? b???n th???t b???i, b???n c?? mu???n th??? l???i ?';
        case 'advancedcalib':
            return 'Hi???u ch???nh n??ng cao th???t b???i, b???n c?? mu???n th??? l???i ?';
        default:
            return false;
    }
};

/**
 * updateDeviceState
 * @param {String} device_id
 * @param {String} action
 * @param {any} data
 * @param {Boolean} retryError
 */
let timeoutHideLoading = false;

export function sendDeviceState(device_id, action, data, retryError = false) {
    return new Promise((resolve, reject) => {
        let args = arguments;
        if (timeoutHideLoading) {
            return resolve(false);
        }
        let pid = setTimeout(() => {
            showHandleLoading("handleDevice");
        }, 1500);
        timeoutHideLoading && clearTimeout(timeoutHideLoading);
        timeoutHideLoading = setTimeout(() => {
            hideHandleLoading("handleDevice");
            timeoutHideLoading = false;
        }, 6000);

        pubDevice(device_id, action, convertMessDevice(data), (res) => {
            timeoutHideLoading && clearTimeout(timeoutHideLoading);
            timeoutHideLoading = false;
            pid && clearTimeout(pid);
            hideHandleLoading("handleDevice");
            if (res === "timeout") {

                vibrationPhone();
                let {device_name} = getDeviceInfo(device_id);
                !retryError && showFlashMessageError("Kh??ng ??i???u khi???n ???????c, vui l??ng ki???m tra m???ng c???a thi???t b??? " + device_name + " !");
                retryError && alertMessage({
                    title: 'Th??ng b??o',
                    message: retryError,
                    buttons: [
                        {
                            name: 'Kh??ng', action: () => {
                            }
                        },
                        {
                            name: 'Th??? l???i', action: () => {
                                sendDeviceState(...args);
                            }
                        },
                    ],
                });
                return resolve(false);
            }
            return resolve(true);
        });
    });
}

export async function checkNotifyPermission() {
    let {status, settings} = await checkNotifications();
    return status === RESULTS.GRANTED;
}
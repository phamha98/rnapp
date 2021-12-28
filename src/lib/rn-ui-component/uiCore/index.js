import AvatartCore from './AvatartCore';
import Layout from './Layout';
import IconCore from './IconCore';
import ViewCore from './ViewCore';
import ImageCore from './ImageCore';
import ImageCustom from './ImageCustom';
import TextCore from './TextCore';
import TouchableCore from './TouchableCore';
import { Dimensions } from 'react-native';
export {
  AvatartCore,
  Layout,
  IconCore,
  ViewCore,
  ImageCore,
  TextCore,
  TouchableCore,
  ImageCustom
};
// export {default as InputBasic} from './InputBasic';
export {default as LabelPicker} from './LabelPicker'
export const screen_width=Dimensions.get("screen").width
export const screen_height=Dimensions.get("screen").height
export {default as AlertMessage} from './AlertMessage'



export * from './Swiper'
export * from './StyleHandle'
export * from './res'
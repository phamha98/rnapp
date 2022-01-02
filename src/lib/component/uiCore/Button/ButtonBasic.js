
// type Props<T> = {
//     active: T;
//     list: T[];
//     onChange: (tab: T) => void;
// };

// export const Tabs = <T,>({ active, list, onChange }: Props<T>): JSX.Element => {
//     return (
//         <>
//             {list.map((tab) => (
//                 <Button onClick={() => onChange(tab)} active={tab === active}>
//                     {tab} 
//                 </Button>
//             ))}
//         </>
//     );
// };

// interface Props {
//     name: string;
//   }
  
  
//   const PrintName2 = (props: Props) => {
//     return (
//       <div>
//         <p style={{ fontWeight: props.priority ? "bold" : "normal" }}>
//           {props.name}
//         </p>
//       </div>
//     )
//   }



  import React from 'react'
  import { StyleSheet, Text, View } from 'react-native'
  
  export default function ButtonBasic() {
      return (
          <View>
              <Text></Text>
          </View>
      )
  }
  
  const styles = StyleSheet.create({})
  
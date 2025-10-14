/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import { KeyboardAvoidingView } from 'react-native';
 import { View, Text, Image, ScrollView, SafeAreaView, TextInput } from 'react-native';
 import Colors from './src/styles/Colors';
 import { SafeAreaProvider } from 'react-native-safe-area-context';
 // import SafeAreaView from 'react-native-safe-area-view';
 import { getResponsiveSize } from './src/utils/AppUtils';
 import LayoutMainView from './src/components/layouts/LayoutMainView';
 
 const Test = () => {
   return (
     <SafeAreaProvider>
       <LayoutMainView isAvoid={true}>
         <ScrollView style={{ flex: 1, backgroundColor: 'red' }}>
 
         </ScrollView>
         <View style={{
           paddingVertical: getResponsiveSize(10),
           backgroundColor: 'blue',
           paddingHorizontal: getResponsiveSize(10)
         }}>
           <TextInput placeholder='Test here...'
             multiline={true}
             style={{
               paddingVertical: getResponsiveSize(10),
               width: '100%',
               backgroundColor: Colors.grey
             }}>
 
           </TextInput>
         </View>
       </LayoutMainView>
     </SafeAreaProvider>
 
   );
 };
 
 export default Test;
 
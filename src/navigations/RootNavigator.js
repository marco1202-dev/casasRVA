import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { LoadingLayout, LoadingManager } from "../presentation";
import AuthNavigator from "./AuthNavigator";
import HomePageTabNavigator from "./HomePageTabNavigator";
import NavigationNames from "./NavigationNames";
import { SocketService } from "../services/SocketService";
import { SocketProvider } from "../context/SocketContext";
import { AuthenticationProvider } from "../context/AuthenticationContext";
import { SafeAreaProvider } from 'react-native-safe-area-context';

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  useEffect(() => {
    SocketService.connect();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <AuthenticationProvider>
        <SocketProvider>
          <NavigationContainer
            theme={{
              dark: false,
              colors: {
                background: "rgb(255, 255, 255)",
                border: "rgb(224, 224, 224)",
                card: "rgb(255, 255, 255)",
                primary: "rgb(0, 122, 255)",
                text: "rgb(28, 28, 30)",
              },
            }}
          >
            <RootStack.Navigator
              screenOptions={{ headerShown: false }}
              mode="modal"
            >
              <RootStack.Screen
                name={NavigationNames.RootScreen}
                component={HomePageTabNavigator}
              />
              <RootStack.Screen
                name={NavigationNames.RootLoginScreen}
                component={AuthNavigator}
              />
            </RootStack.Navigator>
          </NavigationContainer>
        </SocketProvider>
      </AuthenticationProvider>
      <LoadingLayout ref={(ref) => LoadingManager.setLoadingView(ref)} />
    </SafeAreaProvider>
  );
}

export default RootNavigator;

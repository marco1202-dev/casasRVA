import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ChangePasswordScreen from "../screens/auth/ChangePasswordScreen";
import EmailConfirmScreen from "../screens/auth/EmailConfirmScreen";
import NavigationNames from "./NavigationNames";
import KeyConfirmScreen from "../screens/auth/KeyConfirmScreen";

const RootStack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <RootStack.Navigator
      headerMode="screen"
      screenOptions={{ headerShown: false }}
    >
      <RootStack.Screen
        name={NavigationNames.LoginScreen}
        component={LoginScreen}
      />
      <RootStack.Screen
        name={NavigationNames.RegisterScreen}
        component={RegisterScreen}
      />
      <RootStack.Screen
        name={NavigationNames.ChangePasswordScreen}
        component={ChangePasswordScreen}
      />
      <RootStack.Screen
        name={NavigationNames.EmailConfirmScreen}
        component={EmailConfirmScreen}
      />
      <RootStack.Screen
        name={NavigationNames.KeyConfirmScreen}
        component={KeyConfirmScreen}
      />
    </RootStack.Navigator>
  );
}

export default AuthNavigator;

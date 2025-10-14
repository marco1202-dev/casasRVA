import { useNavigation } from "@react-navigation/native";
import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet, TouchableOpacity, Alert,
  ScrollView
} from "react-native";

import {
  TextInput,
  Separator,
  PrimaryButton,
  KeyboardView,
  Text
} from "../../components";
import HeaderLine from "./components/HeaderLine";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { useLocalization } from "../../localization";
import { AuthService } from "../../services";
import { Theme } from "../../theme";
import { NavigationNames } from "../../navigations";
import { SocketService } from "../../services/SocketService";
import { getResponsiveSize } from "../../utils/AppUtils";
import Global from "../../utils/Global";
import LayoutMainView from "../../components/layouts/LayoutMainView";

const RegisterScreen = () => {
  const authContext = useContext(AuthenticationContext);
  const navigation = useNavigation();
  const { getString } = useLocalization();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onClickBackToLogin = () => navigation.goBack();

  const onPressRegister = async () => {
    if (
      name === "" ||
      email === "" ||
      password === ""
    ) {
      Alert.alert(getString("Please fill fields"));
      return;
    }


    AuthService.register(name, email, password, Global.dynamic_agent_id)
      .then(async (user) => {
        await authContext.login(user);
        // x2 goback for first and register screens.
        SocketService.socketLogin(user);

        navigation.navigate(NavigationNames.SearchTab, {
          screen: NavigationNames.SearchScreen
        })
      })
      .catch((e) => Alert.alert(e.message));
  };

  return (
    <LayoutMainView isAvoid={true}>
      <HeaderLine iconName={"arrow-back"} navigation={navigation} />

      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <Text style={styles.titleText}>{getString('Register')}</Text>
        <TextInput
          placeholderTextColor={Theme.colors.gray}
          placeholder={getString("Name")}
          value={name}
          onChangeText={setName}
        />
        <Separator height={16} />
        <TextInput
          placeholderTextColor={Theme.colors.gray}
          placeholder={getString("Email")}
          value={email}
          onChangeText={setEmail}
        />
        <Separator height={16} />
        <TextInput
          placeholderTextColor={Theme.colors.gray}
          placeholder={getString("Password")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <Separator height={24} />
        <PrimaryButton
          title={getString("Register")}
          onPress={onPressRegister}
        />
        <TouchableOpacity

          style={styles.registerButton}
          onPress={onClickBackToLogin}
        >
          <Text style={styles.registerButtonTitle}>
            {getString("Back to Login")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LayoutMainView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
    marginTop: getResponsiveSize(-100)
  },
  titleText: {
    fontSize: 42,
    fontFamily: "rubik-light",
    color: Theme.colors.primaryColor,
    marginBottom: 24,
  },
  registerButton: {
    alignSelf: "center",
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  registerButtonTitle: { color: Theme.colors.black },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
  },
  modalContentContainer: {
    padding: 16,
  },
});

export default RegisterScreen;

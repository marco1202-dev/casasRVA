import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";

import {
  TextInput,
  Separator,
  PrimaryButton,
  Text
} from "../../components";
import LayoutMainView from "../../components/layouts/LayoutMainView";
import { useLocalization } from "../../localization";
import { NavigationNames } from "../../navigations";
import { AuthService } from "../../services";
import { Theme } from "../../theme";
import { getResponsiveSize } from "../../utils/AppUtils";
import HeaderLine from "./components/HeaderLine";

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { getString } = useLocalization();

  const [newPassword, setNewPassword] = useState("");
  const [password, setConfirmPassword] = useState("");

  const onPressConfrim = () => {
    if (
      newPassword === "" ||
      password === ""
    ) {
      Alert.alert(getString("Please fill fields"));
      return;
    }

    if (newPassword !== password) {
      Alert.alert(getString("Please match password and confirm password"));
      return;
    }

    let email = route.params?.email ?? "";

    AuthService.changePassword(email, password)
      .then(async (user) => {
        Alert.alert("Successfully Updated!");
        navigation.navigate(NavigationNames.LoginScreen);
      })
      .catch((e) => Alert.alert(e.message));
  };

  return (
    <LayoutMainView isAvoid={true}>
      <HeaderLine iconName={"arrow-back"} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <Text style={styles.titleText}>{getString("Change Password")}</Text>
        <TextInput
          placeholder={getString("New Password")}
          placeholderTextColor={Theme.colors.gray}
          secureTextEntry={true}
          textContentType="none"
          autoCorrect={false}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <Separator height={16} />
        <TextInput
          placeholder={getString("Confrim Password")}
          placeholderTextColor={Theme.colors.gray}
          secureTextEntry={true}
          textContentType="none"
          autoCorrect={false}
          value={password}
          onChangeText={setConfirmPassword}
        />
        <Separator height={24} />
        <PrimaryButton
          title={getString("Verify")}
          onPress={onPressConfrim}
        />
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
  registerButtonTitle: { color: Theme.colors.gray },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
  },
  modalContentContainer: {
    padding: 16,
  },
});

export default ChangePasswordScreen;

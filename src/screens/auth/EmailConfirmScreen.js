import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert, ScrollView, StyleSheet,
} from "react-native";

import {
  PrimaryButton,
  Separator,
  TextInput,
  Text,
} from "../../components";
import HeaderLine from "./components/HeaderLine";
import { useLocalization } from "../../localization";
import NavigationNames from "../../navigations/NavigationNames";
import { AuthService } from "../../services";
import { Theme } from "../../theme";
import LayoutMainView from "../../components/layouts/LayoutMainView";
import { getResponsiveSize } from "../../utils/AppUtils";

const EmailConfirmScreen = () => {
  const navigation = useNavigation();
  const { getString } = useLocalization();

  const [email, setEmail] = useState("");

  const onPressConfirm = () => {
    if (email === "") {
      Alert.alert(getString("Required User Email"));
      return;
    }
    AuthService.forgotPassword(email)
      .then(async () => {
        navigation.navigate(NavigationNames.KeyConfirmScreen, { email });
      })
      .catch((e) => Alert.alert(e.message));
  };

  return (
    <LayoutMainView isAvoid={true}>
      <HeaderLine navigation={navigation} />
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <Text style={styles.titleText}>{getString("Confirm Email")}</Text>
          <TextInput
            placeholderTextColor={Theme.colors.gray}
            placeholder={getString("User Email")}
            value={email}
            onChangeText={setEmail}
          />

          <Separator height={32} />
          <PrimaryButton
            title={getString("Confirm")}
            onPress={onPressConfirm}
          />
        </ScrollView>
    </LayoutMainView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
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
  forgotButton: {
    alignSelf: "center",
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  }
});

export default EmailConfirmScreen;

import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert, ScrollView, StyleSheet, TouchableOpacity,
} from "react-native";
import {
  PrimaryButton,
  Separator,
  Text,
} from "../../components";
import HeaderLine from "./components/HeaderLine";
import { useLocalization } from "../../localization";
import NavigationNames from "../../navigations/NavigationNames";
import { AuthService } from "../../services";
import { Theme } from "../../theme";

import OTPInputView from '@twotalltotems/react-native-otp-input'
import Colors from "../../styles/Colors";
import { getResponsiveSize, getStrVal } from "../../utils/AppUtils";
import CommonStyles from "../../styles/CommonStyles";
import LayoutMainView from "../../components/layouts/LayoutMainView";

const KeyConfirmScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { getString } = useLocalization();
  const [otpCode, setOtpCode] = useState("");

  const onResendCode = () => {
    AuthService.forgotPassword(route.params?.email)
      .then(() => {
        Alert.alert("Successfully sent");
      })
      .catch((e) => Alert.alert(e.message));
  };

  const onPressVerify = () => {
    AuthService.confirVerify(route.params?.email, otpCode)
      .then((res) => {
        if (res.data?.error) {
          Alert.alert(getString("Code is wrong!"));
          return;
        }
        navigation.navigate(NavigationNames.ChangePasswordScreen, { email: route.params?.email });
      }).catch((e) => Alert.alert(e.message))
  }

  return (
    <LayoutMainView isAvoid={true}>
      <HeaderLine iconName={"arrow-back"} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <Text style={styles.titleText}>{getString("Please Verify")}</Text>
        <OTPInputView
          style={styles.otp_input}
          pinCount={6}
          autoFocusOnLoad={false}
          codeInputFieldStyle={styles.pinContainer}
          codeInputHighlightStyle={{ borderColor: Colors.seafoamBlue }}
          onCodeFilled={(code) => {
            setOtpCode(getStrVal(code))
          }}
        />

        <Separator height={32} />
        <PrimaryButton
          disabled={otpCode === ''}
          buttonStyle={otpCode?.length < 6 ? CommonStyles.btnDisabled : null}
          title={getString("Verify")}
          onPress={() => onPressVerify()}
        />
        <Separator height={8} />

        <TouchableOpacity
          style={[styles.forgotButton]}
          onPress={() => onResendCode()}
        >
          <Text style={styles.registerButtonTitle}>
            {getString("Resend Verification Code")}
          </Text>
        </TouchableOpacity>

        <Separator height={8} />
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
  },
  otp_input: {
    width: '100%',
    paddingHorizontal: 20,
    height: 60
  },
  pinContainer: {
    backgroundColor: Colors.whiteGrey,
    borderRadius: 3,
    fontSize: 15,
    color: Colors.seafoamBlue,
    fontFamily: 'rubik-Medium'
  },
});

export default KeyConfirmScreen;

import React, { useEffect, useState } from "react";
import { View } from "react-native";
import WebView from "react-native-webview";

import EnPolicyContent from './EnPolicyContent';
import EsPolicyContent from "./EsPolicyContent";

import { useLocalization } from "../../localization";

const PrivacyPolicyScreen = () => {
  const { currentLanguage } = useLocalization();

  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ html: currentLanguage() === "es" ? EsPolicyContent : EnPolicyContent }} />
    </View>
  );
};

export default PrivacyPolicyScreen;

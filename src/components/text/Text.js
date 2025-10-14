import React from "react";
import {
  Text as RNText,
  TextProps,
  StyleProp,
  TextStyle,
  StyleSheet,
  I18nManager,
} from "react-native";

import { Theme } from "../../theme";

export const Text = ({ children, style }) => {
  const flattedStyle = StyleSheet.flatten(style);

  return (
    <RNText
      style={[
        style,
        {
          includeFontPadding: false,
          fontFamily:
            flattedStyle && flattedStyle.fontFamily
              ? flattedStyle.fontFamily
              : "rubik-regular",
          color:
            flattedStyle && flattedStyle.color
              ? flattedStyle.color
              : Theme.colors.textColor,
          writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
        },
      ]}
    >
      {children}
    </RNText>
  );
};

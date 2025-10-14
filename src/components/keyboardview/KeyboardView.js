import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export const KeyboardView = ({ style, children }) => {
  return (
    <KeyboardAvoidingView
      style={style}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

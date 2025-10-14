import React from "react";
import {
  View,
  StyleSheet,
  TextInput as RNTextInput,
  I18nManager,
} from "react-native";

import { Theme } from "../../theme";

export const TextInput = (props) => {
  return (
    <View style={[styles.container, props.style]}>
      <RNTextInput
        {...props}
        style={[
          styles.input,
          {
            writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
          },

        ]}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    borderColor: Theme.colors.lightgray,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#00000010",
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  input: {
    fontSize: 15,
    paddingHorizontal: 16,
    height: Theme.sizes.inputHeight,
    fontFamily: "rubik-regular",
  },
});

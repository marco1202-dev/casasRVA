import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../styles/Colors";

import { Theme } from "../../theme";
import { Text } from "../text";

export const PrimaryButton = ({ title, onPress, buttonStyle, disabled }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.container, buttonStyle, disabled && styles.disabledColor]} >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.primaryColor,
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: Theme.sizes.boxBorderRadius,
    borderColor: "white",
    borderWidth: 0,
    shadowColor: "#00000020",
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  disabledColor: {
    backgroundColor: Colors.disableBackground
  },
  text: { color: "white", fontSize: 16, fontFamily: "rubik-medium" },
});

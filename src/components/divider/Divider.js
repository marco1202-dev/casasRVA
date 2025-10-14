import React from "react";
import { View, StyleSheet } from "react-native";

import { Theme } from "../../theme";

export const Divider = ({ style, mh16 }) => {
  return (
    <View style={[styles.container, style, mh16 && { marginHorizontal: 16 }]} />
  );
};

const styles = StyleSheet.create({
  container: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Theme.colors.lightgray,
  },
});

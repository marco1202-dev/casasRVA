import React from "react";
import { View, StyleSheet } from "react-native";

import { Text } from "../text";

export const SectionHeader = ({ title, mTop }) => {
  return (
    <View style={[styles.container, mTop && { marginTop: mTop }]}>
      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  titleText: {
    fontFamily: "rubik-medium",
    fontSize: 18,
  },
});

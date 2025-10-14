import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import Ionicons from 'react-native-vector-icons/Ionicons';

const HeaderLine = ({ iconName, navigation }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ flex: 1, alignItems: "center", marginStart: 60 }}>
        <View style={styles.line} />
      </View>
      <TouchableOpacity
        style={styles.topButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name={iconName ?? "md-close"} size={32} color="lightgray" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  line: {
    width: 120,
    height: 5,
    backgroundColor: "lightgray",
    borderRadius: 5,
    marginVertical: 12,
    opacity: 0.5,
  },
  topButton: {
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: 12,
  },
});

export default HeaderLine;

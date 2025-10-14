import React from "react";
import {
  StyleSheet,
  View,
} from "react-native";

import FastImage from "react-native-fast-image";

export const Avatar = (props) => {
  return (
    <View style={[styles.container, props.style]}>
      <FastImage
        source={props.source}
        style={[styles.image, props.imageStyle]}
        resizeMode="stretch"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: 64,
    height: 64,
  },
});

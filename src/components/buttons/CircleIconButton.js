import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Box } from "../box";
import CommonStyles from "../../styles/CommonStyles";

export const CircleIconButton = (props) => {
  return (
    <TouchableOpacity style={props.style} onPress={props.onPress}>
      <Box
        style={[
          styles.box,
          props.size && {
            width: props.size,
            height: props.size,
            borderRadius: props.size,
          },
          props.circleStyle
        ]}
      >
        <Ionicons
          name={props.iconName}
          size={props.iconSize ?? 23}
          color={props.iconColor}
          style={[styles.icon, props.iconStyle]}
        />
      </Box>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    width: 38,
    height: 38,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  icon: { marginTop: 4 },
});

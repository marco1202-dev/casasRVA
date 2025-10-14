import React from "react";
import { View } from "react-native";

import { Theme } from "../../theme";

export const Separator = ({
  vertical,
  horizontal,
  width,
  height,
}) => {
  return (
    <View
      style={[
        !vertical &&
        !horizontal && { height: height ?? Theme.sizes.separatorSize },
        horizontal && { width: width ?? Theme.sizes.separatorSize },
      ]}
    />
  );
};

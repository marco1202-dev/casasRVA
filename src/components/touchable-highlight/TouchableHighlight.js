import React from "react";
import { TouchableHighlight as RCTouchableHighlight  } from "react-native";

import { Theme } from "../../theme";

export const TouchableHighlight = (props) => (
  <RCTouchableHighlight
    underlayColor={
      props.underlayColor || Theme.colors.touchableHighlightUnderlayColor
    }
    onPress={props.onPress}
    style={props.style}
  >
    {props.children}
  </RCTouchableHighlight>
);

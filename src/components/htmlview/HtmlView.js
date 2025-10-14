import React from "react";
import { StyleSheet, useWindowDimensions, I18nManager } from "react-native";
import HTML from "react-native-render-html";

import { Theme } from "../../theme";

export const HtmlView = (props) => {
  const { width } = useWindowDimensions();
  return (
    <HTML
      baseFontStyle={styles.htmlBaseFontStyle}
      source={{
        html: props.htmlContent
      }}
      contentWidth={width}
      // imagesMaxWidth={
      //   width - props.imagesMaxWidthOffset
      // }
      // ignoredStyles={["font-family"]}
      tagsStyles={{
        p: { marginVertical: 8 },
        h1: {
          marginTop: 12,
          marginBottom: 2,
          fontSize: 24,
          fontFamily: "rubik-medium",
        },
        h2: {
          marginTop: 12,
          marginBottom: 2,
          fontSize: 22,
          fontFamily: "rubik-medium",
        },
        h3: {
          marginTop: 12,
          marginBottom: 2,
          fontSize: 20,
          fontFamily: "rubik-medium",
        },
        h4: {
          marginTop: 12,
          marginBottom: 2,
          fontSize: 16,
          fontFamily: "rubik-medium",
        },
        strong: { fontFamily: "rubik-medium" },
      }}
    />
  );
};

const styles = StyleSheet.create({
  htmlBaseFontStyle: {
    color: Theme.colors.black,
    fontSize: 15,
    fontFamily: "rubik-regular",
    writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
    textAlign: "justify",
  },
});

import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from "react-native-linear-gradient";
import numeral from "numeral";
import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import FastImage from 'react-native-fast-image';

import { useLocalization } from "../../../localization";
import { Theme } from "../../../theme";
import { Box } from "../../../components/box";
import { Text } from "../../../components/text";

const HomeHighlightedItemView = ({
  item,
  onClick,
}) => {
  const { getString } = useLocalization();
  return (
    <TouchableOpacity onPress={onClick} activeOpacity={1}>
      <Box style={styles.container}>
        <FastImage
          style={[styles.imgBackNew, { borderRadius: Theme.sizes.boxBorderRadius }]}
          // imageStyle={{ borderRadius: Theme.sizes.boxBorderRadius }}
          source={{
            uri: item.photos?.length > 0 ? item.photos[0] : ''
          }} />
        <View style={styles.rowsContainer}>
          <LinearGradient
            colors={["transparent", "#000000"]}
            style={styles.gradientLayout}
          >
            <View style={styles.flex1}>
              <Text style={styles.titleText}>
                {`$${numeral(item.ListPrice).format("0,0")}`}
              </Text>
              <View style={[styles.locationAreaContainer]}>
                <Text style={[styles.locationText, { flex: 1 }]}>
                  <Entypo name="location-pin" size={14} />
                  {` ${item.region}  `}
                </Text>
                <Text style={[styles.locationText]}>
                  <MaterialCommunityIcons name="floor-plan" size={14} />
                  {` ${item.size}`}
                </Text>
              </View>
            </View>

          </LinearGradient>
        </View>
      </Box>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  imgBack: {
    flex: 1,
    height: 200,
    backgroundColor: 'red'
  },
  imgBackNew: {
    flex: 1,
    height: 200,
    backgroundColor: 'red',
  },
  flex1: { flex: 1 },
  labelContent: {
    backgroundColor: Theme.colors.yellow,
    position: "absolute",
    paddingHorizontal: 8,
    paddingVertical: 4,
    left: 16,
    top: 16,
    borderRadius: 4,
  },
  labelText: {
    color: "white",
    fontFamily: "rubik-medium",
    fontSize: 12,
  },
  rowsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  gradientLayout: {
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
  },
  titleText: {
    color: "white",
    fontSize: 19,
    fontFamily: "rubik-bold",
    textAlign: "justify",
  },
  locationText: {
    color: "white",
    marginTop: 6,
    fontSize: 13,
    textAlign: "justify",
  },
  moneyText: {
    color: "white",
    fontSize: 22,
    fontFamily: "rubik-medium",
    alignSelf: "flex-end",
  },
  locationAreaContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default HomeHighlightedItemView;

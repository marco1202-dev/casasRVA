import Entypo from 'react-native-vector-icons/Entypo';

import ViewPager from "@react-native-community/viewpager";
import numeral from "numeral";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
// import { Pagination } from "react-native-snap-carousel";

import FastImage from 'react-native-fast-image';
import { Theme } from "../../theme";
import { Box } from "../box";
import { Text } from "../text";
import { getResponsiveSize } from '../../utils/AppUtils';

const SLIDER_HEIGHT = 180;

const InterestedItemView = ({ dataInfo }) => {
  const [indicatorIndex, setIndicatorIndex] = useState(0);

  const onPageSelected = (event) => {
    setIndicatorIndex(event.nativeEvent.position);
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={{ overflow: "hidden" }}>
          <ViewPager
            style={[styles.viewPager]}
            initialPage={0}
            onPageSelected={onPageSelected}
          >
            {dataInfo?.photos?.length > 0 ?
              dataInfo?.photos?.slice(0, 5).map((item, index) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  key={`pageItemKey${index}`}
                >
                  <FastImage key={index}
                    source={{
                      uri: item,
                    }}
                    style={styles.viewPagerItemImage}
                  />
                </TouchableOpacity>
              )) :
              <TouchableOpacity
                activeOpacity={0.9}
              >
                <View />
              </TouchableOpacity>
            }
          </ViewPager>
        </View>
        {/* <Pagination
          dotsLength={Math.min(dataInfo?.photos.length, 5)}
          activeDotIndex={indicatorIndex}
          dotColor={Theme.colors.primaryColor}
          inactiveDotColor={Theme.colors.lightgray}
          inactiveDotScale={0.8}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.paginationDot}
        /> */}
      </View>
      <View style={styles.mv14}>
        <Text style={styles.priceText}>
          {`$${numeral(dataInfo?.ListPrice).format("0,0")}`}
        </Text>
        <View style={styles.infoContainer}>
          <View style={{ flexDirection: "row" }}>
            <Entypo name="location-pin" size={14} />
            <Text style={styles.locationText}>{dataInfo?.address?.trim() + ", " + dataInfo?.region}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginHorizontal: 4 },
  viewPager: { height: SLIDER_HEIGHT, overflow: "hidden" },
  viewPagerItemImage: {
    flex: 1,
    borderTopLeftRadius: Theme.sizes.boxBorderRadius,
    borderTopRightRadius: Theme.sizes.boxBorderRadius,
  },
  paginationContainer: {
    position: "absolute",
    margin: 0,
    minHeight: 0,
    paddingVertical: 0,
    bottom: 14,
    alignSelf: "center",
  },
  paginationDot: { marginHorizontal: -20 },
  labelContent: {
    backgroundColor: Theme.colors.yellow,
    position: "absolute",
    paddingHorizontal: 8,
    paddingVertical: 4,
    left: 16,
    top: 16,
    borderRadius: 4,
    zIndex: 10,
  },
  labelText: {
    color: "white",
    fontFamily: "rubik-medium",
    fontSize: 11,
  },
  likeIcon: {
    position: "absolute",
    top: SLIDER_HEIGHT - 18,
    right: 16,
    zIndex: 5,
  },
  ph16: { paddingHorizontal: 16 },
  mv14: { paddingVertical: 14 },
  priceText: {
    fontFamily: "rubik-medium",
    fontSize: 18,
    color: Theme.colors.textColor,
    textAlign: "justify",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    opacity: 0.4,
  },
  locationText: {
    color: "black",
    fontSize: 13,
    fontFamily: "rubik-medium",
  },
  propertiesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingVertical: 14,
    alignItems: "center",
    alignContent: "center",
  },
  propertyContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  propertyTitle: {
    marginStart: 8,
    fontSize: 12,
    marginTop: 1,
    marginTop: getResponsiveSize(6),
    color: Theme.colors.yellowDark,
    fontFamily: "rubik-medium",
  },
});

export default InterestedItemView;

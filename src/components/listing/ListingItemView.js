import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ViewPager from "@react-native-community/viewpager";
import { useNavigation } from "@react-navigation/native";
import numeral from "numeral";
import React, { useContext, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity, View
} from "react-native";

import FastImage from 'react-native-fast-image';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { useLocalization } from "../../localization";
import NavigationNames from "../../navigations/NavigationNames";
import { ListingService } from "../../services";
import Colors from '../../styles/Colors';
import CommonStyles from '../../styles/CommonStyles';
import { Theme } from "../../theme";
import { getResponsiveSize, getStatusInfo } from '../../utils/AppUtils';
import { Box } from "../box";
import { LikeButton } from "../buttons";
import { Divider } from "../divider";
import { Text } from "../text";

const SLIDER_HEIGHT = 180;

const ListingItemView = ({ model: dataInfo, onClick }) => {
  const { user, logout } = useContext(AuthenticationContext);
  const authContext = useContext(AuthenticationContext);
  let favorites = authContext.user?.favorites ?? [];

  const navigation = useNavigation();
  const { getString } = useLocalization();
  const [indicatorIndex, setIndicatorIndex] = useState(0);

  const checkIsLiked = () => {
    let favor = favorites.find(item => item.MLSID?.toString() === dataInfo?.MLSID);
    return favor ? true : false;
  }

  const isLiked = checkIsLiked();

  const onPressLikeMe = () => {
    if (!user) {
      navigation.navigate(NavigationNames.RootLoginScreen);
      return;
    }

    ListingService.likeProperty(dataInfo?.MLSID, !isLiked, dataInfo?.address)
      .then((res) => {

        let data = res.data;
        if (data?.error === 'LOGOUT') {
          logout();
          navigation.navigate(NavigationNames.RootLoginScreen);
          return;
        }

        let newFavorites = data ?? [];

        let user = authContext.user;
        user.favorites = [...newFavorites];
        authContext.login({ ...user });
      })
      .catch((err) => alert(err.message));
  };

  const onPageSelected = (event) => {
    setIndicatorIndex(event.nativeEvent.position);
  };

  let statusInfo = getStatusInfo(dataInfo);
  return (
    <Box style={styles.container}>
      <LikeButton
        isLiked={isLiked}
        onClick={() => onPressLikeMe()}
        style={styles.likeIcon}
      />
      <View>
        <View style={{ overflow: "hidden" }}>
          <ViewPager
            style={[styles.viewPager]}
            initialPage={0}
            onPageSelected={onPageSelected}
          >
            {dataInfo?.photos?.length > 0 ?
              dataInfo?.photos?.slice(0, 5).map((item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onClick}
                    key={`pageItemKey${index}`}
                  >
                    <View style={[CommonStyles.statusContainer,
                    CommonStyles.center,
                    { backgroundColor: statusInfo.color }]}>
                      <Text style={[CommonStyles.main_font_medium, { color: Colors.white }]}>{getString(statusInfo.name)}</Text>
                    </View>
                    <FastImage key={index}
                      source={{
                        uri: item,
                      }}
                      style={styles.viewPagerItemImage}
                    />
                  </TouchableOpacity>
                )
              }) :
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={onClick}
              >
                <View style={[CommonStyles.statusContainer,
                  CommonStyles.center,
                  { backgroundColor: statusInfo.color }]}>
                    <Text style={[CommonStyles.main_font_medium, { color: Colors.white }]}>{getString(statusInfo.name )}</Text>
                  </View>
                <View />
              </TouchableOpacity>
            }
          </ViewPager>
        </View>
      </View>
      <TouchableOpacity onPress={onClick}>
        <View style={styles.ph16}>
          <View style={styles.mv14}>
            <Text style={styles.priceText}>
              {`$${numeral(dataInfo?.ListPrice).format("0,0")}`}
            </Text>
            <View style={styles.infoContainer}>
              <View style={{ flexDirection: "row" }}>
                <Entypo name="location-pin" size={14} />
                <Text style={styles.locationText}>{dataInfo?.region}</Text>
              </View>

              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons name="floor-plan" size={14} />
                <Text style={styles.locationText}>{dataInfo?.size}</Text>
              </View>
            </View>
          </View>
          <Divider />
          <View style={styles.propertiesContainer}>
            <View style={styles.propertyContent}>
              <FontAwesome name="bed" size={20} color={Theme.colors.primaryColor} />
              <Text style={styles.propertyTitle}>
                {getString("bedroomWithCount", {
                  count: dataInfo?.bedroom,
                })}
              </Text>
            </View>

            <View style={styles.propertyContent}>
              <FontAwesome name="bath" size={20} color={Theme.colors.primaryColor} />
              <Text style={styles.propertyTitle}>
                {getString("bathroomWithCount", {
                  count: dataInfo?.bathroom,
                })}
              </Text>
            </View>
            <View style={styles.propertyContent}>
              <FontAwesome5Icon
                name="ruler-combined"
                size={17}
                color={Theme.colors.primaryColor}
              />
              <Text style={styles.propertyTitle}>
                {numeral(dataInfo?.LivingArea).format("0,0") + ' ft2'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: { marginHorizontal: 16 },
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
    backgroundColor: Theme.colors.primaryColor,
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
    color: Theme.colors.primaryColorDark,
    fontFamily: "rubik-medium",
  },
});

export default ListingItemView;

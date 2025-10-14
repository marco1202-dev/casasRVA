import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ViewPager from "@react-native-community/viewpager";
import React, { useContext, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import FastImage from 'react-native-fast-image';
import LinearGradient from "react-native-linear-gradient";
import { LikeButton } from "../../../components/buttons";
import { Text } from "../../../components/text";
import { AuthenticationContext } from "../../../context/AuthenticationContext";
import NavigationNames from "../../../navigations/NavigationNames";
import { ListingService } from "../../../services";
import CommonStyles from '../../../styles/CommonStyles';

const ListingDetailHeaderView = ({
  model,
  onPressPhoto,
  navigation
}) => {
  const { user, logout } = useContext(AuthenticationContext);
  const [indicatorIndex, setIndicatorIndex] = useState(0);

  const authContext = useContext(AuthenticationContext);

  let favorites = user?.favorites ?? [];

  const checkIsLiked = () => {
    let favor = favorites.find(item => item.MLSID?.toString() === model?.MLSID);
    return favor ? true : false;
  }

  const isLiked = checkIsLiked();

  const onClickLike = () => {
    if (!user) {
      navigation.navigate(NavigationNames.RootLoginScreen);
      return;
    }

    ListingService.likeProperty(model?.MLSID, !isLiked, model?.address)
      .then((res) => {
        let data = res.data;
        if (data?.error === 'LOGOUT') {
          logout();
          navigation.navigate(NavigationNames.RootLoginScreen);
          return;
        }

        let newFavorites = res.data ?? [];

        let user = authContext.user;
        user.favorites = [...newFavorites];
        authContext.login({ ...user });
      })
      .catch((err) => alert(err.message));
  };

  const images = (model?.photos ?? []).map((p) => (typeof p === 'string' ? p : (p?.uri || p?.url || p?.MediaURL || ''))).filter(Boolean);
  return (
    <View>
      {
        images?.length > 0 ?
          <ViewPager
            style={styles.viewPager}
            initialPage={0}
            onPageSelected={(e) => setIndicatorIndex(e.nativeEvent.position)}
          >
            {images?.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.9}
                key={`pagerItemKey${index}`}
                onPress={() => onPressPhoto(index, item)}
              >
                {item ? (
                  <FastImage source={{ uri: String(item) }} style={styles.flex1} />
                ) : (
                  <View style={[styles.flex1, { backgroundColor: '#e5e7eb' }]} />
                )}
              </TouchableOpacity>
            ))}
          </ViewPager>
          :
          <View
            activeOpacity={0.9}
            style={{height: 340}}
          >
          </View>
      }

      <LinearGradient
        colors={["transparent", "black"]}
        style={styles.gradient}
        pointerEvents="none"
      >
        <View style={[CommonStyles.flex_row]}>
          <Text style={[styles.locationText]}>
            {model?.address}
          </Text>
        </View>
        <View style={[CommonStyles.flex_row]}>
          <Text style={[styles.locationText, { flex: 1 }]}>
            <Entypo name="location-pin" size={14} />
            {` ${model?.region}  `}
          </Text>
          <Text style={[styles.locationText]}>
            <MaterialCommunityIcons name="floor-plan" size={14} />
            {` ${model?.size}`}
          </Text>
        </View>
      </LinearGradient>
      <LikeButton
        isLiked={isLiked}
        onClick={onClickLike}
        style={styles.likeIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  viewPager: { height: 340 },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  locationText: {
    color: "white",
    marginTop: 8,
    fontSize: 13,
    textAlign: "justify",
  },
  likeIcon: {
    position: "absolute",
    bottom: -18,
    right: 16,
    zIndex: 100,
  }
});

export default ListingDetailHeaderView;

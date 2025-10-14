import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useNavigation, useRoute } from "@react-navigation/native";
import numeral from "numeral";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert, Animated, FlatList, Linking, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import FastImage from 'react-native-fast-image';
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {
  HeaderButton,
  HeaderButtons,
  Item
} from "react-navigation-header-buttons";

import ReactNativeModal from 'react-native-modal';
import {
  Avatar, Box,
  CircleIconButton, Divider, HtmlView,
  PrimaryButton, SectionHeader, Separator
} from "../../components";
import DlgPhotoViewer from '../../components/dialogs/DlgPhotoViewer';
import LayoutMainView from '../../components/layouts/LayoutMainView';
import InterestedItemView from '../../components/listing/InterestedItemView';
import { SCREEN_HOR_PADDING } from '../../constants';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import { useLocalization } from "../../localization";
import { NavigationNames } from '../../navigations';
import { ListingService } from '../../services';
import { SocketService } from '../../services/SocketService';
import Colors from '../../styles/Colors';
import CommonStyles from '../../styles/CommonStyles';
import { Theme } from "../../theme";
import { getRandomVal, getResponsiveSize } from '../../utils/AppUtils';
import Geocoding from '../../utils/Geocoding';
import Global from '../../utils/Global';
import ListingDetailHeaderView from './components/ListingDetailHeaderView';

const SectionContent = ({ title, children, contentStyle }) => (
  <View style={{ paddingVertical: 8 }}>
    <SectionHeader title={title} />
    <View style={[styles.sectionChildrenContent, contentStyle]}>
      {children}
    </View>
  </View>
);

const IoniconsHeaderButton = (props) => (
  <HeaderButton
    {...props}
    IconComponent={Ionicons}
    iconSize={24}
    color={Theme.colors.primaryColor}
  />
);

const ListingDetailScreen = () => {
  const { getString, currentLanguage } = useLocalization();
  const authContext = useContext(AuthenticationContext);
  const user = authContext?.user;
  const navigation = useNavigation();
  const route = useRoute();

  const [showInterestModal, setShowInterestModal] = useState(false);

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null
  });

  const [initialRegion, setInitialRegion] = useState({
    latitudeDelta: null,
    longitudeDelta: null
  });

  const [dlgPhotoViewerInfo, setDlgPhotoViewerInfo] = useState({
    selectedPhotoIndex: 0,
    isShowed: false,
    imageNames: []
  });

  const [dataInfo, setDataInfo] = useState(route.params?.item ?? null);

  const animation = new Animated.Value(0);
  const opacity = animation.interpolate({
    inputRange: [0, 1, 200],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  const onClickPhoto = (index) => {
    setDlgPhotoViewerInfo({
      selectedPhotoIndex: index,
      isShowed: true,
    });
  }

  const getAgentItem = (agent) => {
    let res = null;
    if (user?.agents?.length > 0) {
      let random = getRandomVal(0, user.agents?.length - 1);
      res = user.agents[random];
    } else {
      res = agent;
    }

    return res;
  }

  const onPressIntersted = () => {
    if (!authContext.user) {
      navigation.navigate(NavigationNames.RootLoginScreen);
      return;
    }

    setShowInterestModal(true);
  }

  const onLoadDetailInfo = async () => {

    let item = route.params?.item;
    let region = item?.region ?? null;
    let address = item?.address ?? null;

    let id = route.params?.id;

    let user_id = 0;
    if (authContext?.user) {
      user_id = authContext.user?.id;
    }
    if (id) {
      ListingService.getListingDetailInfo(id, user_id)
        .then(async (res) => {
          setDataInfo({ ...res.data });
        })
        .catch((err) => alert(err.message));
    }

    if (item?.latitude && item?.longitude) {
      setLocation({
        latitude: item.latitude,
        longitude: item.longitude
      });
    } else if (region && address) {
      let fullAddress = `${address}, ${region}`;
      let location = await Geocoding.getLatLong(fullAddress);
      if (location) {
        setLocation({ ...location });
      }
    }
  }

  const onPressSendNote = () => {
    let client_id = Global.user?.id;
    let listing_id = dataInfo?.id;
    let by = Global.user?.role ?? 'client';
    let message = getString("I'm Interested In This Property");

    ListingService.sendRequestNote(client_id, listing_id, by, message)
      .then((res) => {
        Alert.alert(getString("Thank you"));
        setShowInterestModal(false);
      })
      .catch(err => Alert.alert(err.message));

    // send push notificaton
    let agent = dataInfo?.agent ?? null;
    if (Global.user?.role === 'client' && agent?.isAssigned === true) {
      let fcm_key = agent?.fcm_key;
      let data = {
        agent_id: agent?.id,
        MLSID: dataInfo?.MLSID,
        name: user?.name,
        address: dataInfo?.address,
        fcm_key
      }

      SocketService.sendNotificationToAgent(data);
    }
  }

  const getAgentEmail = (agent) => {
    if (agent.isAssigned === true) {
      return agent.email;
    }

    return 'thediazteam@buynsellrva.com';
  }

  const getAgentPhone = (agent) => {
    if (agent.isAssigned === true) {
      return agent.phone;
    }

    return '8043128222';
  }

  useEffect(() => {
    if (location.latitude) {
      setTimeout(() => {
        setInitialRegion({
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        })
      }, 400);
    }
  }, [location.latitude]);

  useEffect(() => {
    onLoadDetailInfo();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: `MLS #${dataInfo?.MLSID}`,
      headerTransparent: true,
      headerTintColor: Theme.colors.primaryColorDark,
      headerTitleStyle: { opacity },
      headerBackground: () => (
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.headerView, { opacity }]}
        >
          <Divider style={styles.headerDivider} />
        </Animated.View>
      ),
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title={getString("")}
            iconName="md-share-social"
            onPress={() =>
              Share.share({
                title: "",
                message: getString("ShareTitle") + ` MLS #${dataInfo?.MLSID}, ${dataInfo?.address}, ${dataInfo?.region}`
              })
            }
          />
        </HeaderButtons>
      ),
    });
  }, [opacity]);

  const onPressMap = (location) => {
    let address = dataInfo?.address?.trim();
    let region = dataInfo?.region;

    let url = `https://www.google.com/maps/place/${address},${region}`;
    Linking.openURL(url);
  }

  const agentInfo = getAgentItem(dataInfo?.agent);

  return (
    <LayoutMainView>
      <ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        onScroll={Animated.event([
          { nativeEvent: { contentOffset: { y: animation } } },
        ], { useNativeDriver: false })}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
      >

        <ListingDetailHeaderView model={dataInfo} onPressPhoto={onClickPhoto} navigation={navigation} />

        <View style={[styles.moneyContainer, CommonStyles.flex_row]}>
          <View style={{ flex: 1, marginEnd: getResponsiveSize(10) }}>
            <Text style={styles.moneyTitle}>{getString("Price")}</Text>
            <Text style={styles.moneyText}>
              {`$${numeral(dataInfo?.ListPrice).format("0,0")}`}
            </Text>
          </View>
          <View>
            <Text style={styles.mlsidText}>
              {`#${dataInfo?.MLSID}`}
            </Text>
          </View>
        </View>
        <Divider />
        <View>
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
                {numeral(dataInfo?.LivingArea).format('0,0') + ' ft2'}
              </Text>
            </View>
          </View>
        </View>
        <Divider />
        <SectionContent
          title={getString("Description")}
          contentStyle={{ marginTop: -4 }}
        >
          {
            (!!dataInfo?.EsDescription || !!dataInfo?.PublicRemarks) &&
            <HtmlView
              htmlContent={currentLanguage() === 'es' && dataInfo?.EsDescription ? dataInfo?.EsDescription : dataInfo?.PublicRemarks}
            // imagesMaxWidthOffset={32}
            />
          }
        </SectionContent>
        <Divider />
        <SectionContent
          title={getString("Seller's Representative")}
          contentStyle={{ marginTop: -4 }}
        >
          <Text style={[]}>
            {dataInfo.ListOfficeName}
          </Text>
        </SectionContent>
        <Divider />
        <SectionContent title={getString("Photos")}>
          <FlatList
            data={dataInfo?.photos ?? []}
            renderItem={({ index, item }) => (
              <TouchableOpacity onPress={() => onClickPhoto(index)}>
                <Box>
                  {(() => {
                    const url = (typeof item === 'string') ? item : (item?.uri || item?.url || item?.MediaURL || '');
                    if (url) {
                      return <FastImage source={{ uri: String(url) }} style={styles.previewImage} />
                    }
                    return <View style={[styles.previewImage, { backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' }]}><Text style={{ color: '#9ca3af', fontSize: 12 }}>No Photo</Text></View>
                  })()}
                </Box>
              </TouchableOpacity>
            )}
            keyExtractor={(_, index) => `propertyImageKey${index}`}
            horizontal
            ItemSeparatorComponent={() => <Separator horizontal />}
            contentContainerStyle={styles.previewImagesContainer}
            style={styles.previewImages}
            showsHorizontalScrollIndicator={false}
          />
        </SectionContent>
        <Divider />
        {
          dataInfo?.features?.length > 0 && (
            <>
              <SectionContent title={getString("Features")}>
                {dataInfo?.features
                  .filter((a) => a !== "")
                  .map((feature, index) => (
                    <View
                      style={styles.propertyDetailRow}
                      key={`featureKey${index}`}
                    >
                      <Ionicons
                        name="ios-checkmark-circle-outline"
                        color={Theme.colors.primaryColorDark}
                        size={22}
                      />
                      <Text style={styles.propertyDetailTitle}>
                        {feature.trim()}
                      </Text>
                    </View>
                  ))}
              </SectionContent>
              <Divider />
            </>
          )
        }
        {
          location.latitude &&
          <SectionContent title={getString("Location")}>
            <View style={styles.mapViewContainer}>
              <MapView
                style={styles.mapView}
                provider={PROVIDER_GOOGLE}
                scrollEnabled={false}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: initialRegion.latitudeDelta ?? 0.0822,
                  longitudeDelta: initialRegion.latitudeDelta ?? 0.0521,
                }}
                onPress={() => onPressMap(location)}
              >
                <Marker
                  coordinate={location}
                />
              </MapView>
            </View>
          </SectionContent>
        }
        <Divider />
        {
          agentInfo &&
          <SectionContent
            title={getString("Contact")}
            contentStyle={CommonStyles.flex_row}
          >
            <View style={{ marginEnd: getResponsiveSize(10) }}>
              <Avatar source={!!agentInfo?.avatar ? { uri: agentInfo?.avatar } : require('../../../assets/default-avatar.png')}
                style={{ borderRadius: 30 }}
                imageStyle={{ width: 50, height: 50 }}
              />
            </View>
            <View style={styles.flex1}>
              <Text style={styles.contactName}>
                {agentInfo.name}
              </Text>
              <Text style={styles.contactAddress}>{getString('The Diaz Team')}</Text>
            </View>
            <CircleIconButton
              iconColor={Theme.colors.primaryColor}
              iconName="ios-call"
              iconSize={23}
              size={46}
              onPress={() => Linking.openURL(`tel:${getAgentPhone(agentInfo)}`)}
            />
            <CircleIconButton
              iconColor={Theme.colors.primaryColor}
              iconName="ios-mail"
              iconSize={25}
              size={46}
              style={{ marginStart: 16 }}
              onPress={() => Linking.openURL(`mailto:${getAgentEmail(agentInfo)}`)}
            />
          </SectionContent>
        }

        <Divider />
        <View style={[{
          paddingVertical: getResponsiveSize(12),
          paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING)
        }]}>
          <PrimaryButton
            buttonStyle={[{ flex: 1 }]}
            title={getString("I'm Interested")}
            onPress={() => onPressIntersted()}
          />
        </View>
      </ScrollView>
      <DlgPhotoViewer
        imageNames={dataInfo?.photos ?? []}
        selectedImageIndex={dlgPhotoViewerInfo.selectedPhotoIndex}
        visible={dlgPhotoViewerInfo.isShowed}
        isFullUrl={true}
        onSwipeDown={() => {
          setDlgPhotoViewerInfo({
            ...dlgPhotoViewerInfo,
            isShowed: false,
          });
        }}
      />
      <ReactNativeModal
        isVisible={showInterestModal}
        swipeDirection={null}
        style={styles.modal}
        propagateSwipe
      >
        <View style={[{
          paddingVertical: getResponsiveSize(16),
          paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING),
          backgroundColor: Colors.white,
          borderRadius: getResponsiveSize(20)
        }]}>
          <View style={[CommonStyles.flex_row, { paddingBottom: getResponsiveSize(16), justifyContent: 'flex-end' }]}>
            <TouchableOpacity onPress={() => setShowInterestModal(false)}>
              <MaterialCommunityIcons name='close' size={getResponsiveSize(28)} />
            </TouchableOpacity>
          </View>
          <View >
            <Text style={[styles.titleText]}>{getString("I'm Interested In This Property")}:</Text>
          </View>
          <InterestedItemView
            dataInfo={dataInfo}
          />
          {
            agentInfo &&
            <View
              style={[CommonStyles.flex_row, { paddingVertical: getResponsiveSize(20) }]}
            >
              <View style={{ marginEnd: getResponsiveSize(10) }}>
                <Avatar source={!!agentInfo?.avatar ? { uri: agentInfo?.avatar } : require('../../../assets/default-avatar.png')}
                  style={{ borderRadius: 30 }}
                  imageStyle={{ width: 50, height: 50 }}
                />
              </View>
              <View style={styles.flex1}>
                <Text style={styles.contactName}>
                  {agentInfo.name}
                </Text>
                <Text style={styles.contactAddress}>{getString('The Diaz Team')}</Text>
              </View>
            </View>
          }
          <View style={[CommonStyles.flex_row, {
            paddingVertical: getResponsiveSize(16),
            paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING)
          }]}>
            <PrimaryButton
              buttonStyle={{ paddingVertical: 12, flex: 1 }}
              title={getString("NOTIFY AGENT")}
              onPress={() => onPressSendNote()}
            />
          </View>
        </View>
      </ReactNativeModal>
    </LayoutMainView>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  headerView: { backgroundColor: "white" },
  headerDivider: { position: "absolute", bottom: 0, left: 0, right: 0 },
  scrollView: { flex: 1, backgroundColor: "white" },
  scrollViewContainer: { paddingBottom: 24 },
  moneyContainer: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING),
  },
  moneyTitle: {
    fontFamily: "rubik-medium",
    color: Theme.colors.primaryColorDark,
  },
  moneyText: {
    color: Theme.colors.textColor,
    fontSize: 24,
    fontFamily: "rubik-medium",
    paddingVertical: 8,
    textAlign: "justify",
  },
  mlsidText: {
    color: Theme.colors.gray,
    fontSize: 18,
    fontFamily: "rubik-medium",
    paddingVertical: 8,
    textAlign: "justify",
  },
  monthlyText: { fontSize: 14, color: "gray", textAlign: "justify" },
  propertiesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
    alignContent: "center",
  },
  propertyContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  propertyTitle: {
    fontSize: 12,
    marginTop: 8,
    color: "gray",
  },
  previewImages: { marginHorizontal: -16 },
  previewImagesContainer: { paddingVertical: 8, paddingHorizontal: 16 },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: Theme.sizes.boxBorderRadius,
  },
  propertyDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  propertyDetailTitle: {
    fontSize: 15,
    marginStart: 12,
    color: Theme.colors.textColor,
  },
  mapViewContainer: {
    borderRadius: Theme.sizes.boxBorderRadius,
    overflow: "hidden",
  },
  mapView: {
    borderRadius: Theme.sizes.boxBorderRadius,
    height: 180,
  },
  contactContent: {
    flexDirection: "row",
  },
  contactName: {
    fontSize: 18,
    fontFamily: "rubik-medium",
    color: Theme.colors.primaryColorDark,
    textAlign: "justify",
  },
  contactAddress: {
    fontSize: 13,
    fontFamily: "rubik-medium",
    color: "gray",
    marginTop: 4,
  },
  sectionChildrenContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  modal: {
  },
  titleText: {
    fontSize: getResponsiveSize(20),
    fontFamily: "rubik-medium",
    color: Theme.colors.primaryColor,
    marginBottom: 12,
  },
});

export default ListingDetailScreen;

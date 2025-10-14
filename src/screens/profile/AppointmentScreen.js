import {
  useFocusEffect,
  useNavigation,
  useRoute
} from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  FlatList, Linking, RefreshControl, StyleSheet, TouchableOpacity, View
} from "react-native";
import { Divider, Separator, Text } from "../../components";
import {
  NOTIFICATION_LOAD_INFO,
  SCREEN_HOR_PADDING
} from "../../constants";
import { useLocalization } from "../../localization";
import CommonStyles from '../../styles/CommonStyles';

import FastImage from "react-native-fast-image";
import NavigationNames from "../../navigations/NavigationNames";
import { NotificationService } from "../../services/NotificationService";
import { Theme } from "../../theme";
import { getDateTimeFormat, getResponsiveSize, isCloseToBottom } from '../../utils/AppUtils';

const AppointmentScreen = () => {
  const route = useRoute();

  const navigation = useNavigation();

  const [dataInfo, setDataInfo] = useState({
    totalCount: -1,
    list: []
  });
  const { getString } = useLocalization();

  const onLoadListData = (isLoadMore = false) => {
    NOTIFICATION_LOAD_INFO.loadMore = true;
    if (isLoadMore === true) {
      NOTIFICATION_LOAD_INFO.pageNumber += 1;
    } else {
      NOTIFICATION_LOAD_INFO.pageNumber = 0;
    }

    let request = {
      user_id: route.params?.user_id,
      role: route.params?.role,
      pageNumber: NOTIFICATION_LOAD_INFO.pageNumber,
      pageCount: NOTIFICATION_LOAD_INFO.pageCount
    };

    NotificationService.getAppointmentList(request)
      .then(res => {
        let data = res.data;

        setDataInfo({
          totalCount: data?.totalCount ?? 0,
          list: isLoadMore ? [...dataInfo.list, ...data?.list] : [...data?.list]
        });

        setTimeout(() => {
          NOTIFICATION_LOAD_INFO.loadMore = false;
        }, 500);
      })
      .catch(err => {
        console.log(err);
      })
  }

  useFocusEffect(
    useCallback(() => {
      onLoadListData();
      return () => {
        // alert('screen was unfocused')
      }
    }, [])
  );

  const onGotoListingDetail = (item) => {
    navigation.navigate(NavigationNames.ProfileTab_ListingDetailScreen, {
      item: item?.listing,
      id: item?.listing_id
    });
  }

  const onPressAddress = (item) => {
    let listing = item.listing;
    let address = listing.address?.trim();
    let region = listing.region;

    let url = `https://www.google.com/maps/place/${address} ${region}`;

    Linking.openURL(url);
  }

  const getAvatar = (item) => {

    let res = require('../../../assets/default-avatar.png');

    let avatar = require('../../../assets/default-avatar.png');
    if (route.params?.role === 'agent') {
      if (!!item.client?.avatar) {
        res = {
          uri: item.client?.avatar
        }
      }
    } else {
      if (!!item.agent?.avatar) {
        res = {
          uri: item.agent?.avatar
        }
      }
    }

    return res;
  }

  const renderItem = ({ item, index }) => {
    return (
      <View style={{ paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING) }}>
        <View style={[CommonStyles.flex_row]}>
          <TouchableOpacity onPress={() => onGotoListingDetail(item)} style={{ alignItems: 'center' }} >
            <FastImage source={{ uri: item.listing?.photo }} style={{ width: 100, minHeight: 60, backgroundColor: '#dddddd' }} />
            <Text style={[CommonStyles.main_font_regular, {
              marginTop: getResponsiveSize(8),
              fontSize: getResponsiveSize(12),
              textAlign: 'center'
            }]}>#{item.listing?.MLSID}</Text>
          </TouchableOpacity>
          <View style={{ flex: 3, paddingHorizontal: getResponsiveSize(8) }}>
            <Text style={[CommonStyles.main_font_bold]}>{getDateTimeFormat(item.start, 'ddd M/DD/YY @ hh:mmA')}</Text>
            <TouchableOpacity onPress={() => onPressAddress(item)} style={{ flex: 1, marginTop: getResponsiveSize(10) }}>
              <Text style={[CommonStyles.main_font_regular]}>{item.listing?.address}</Text>
              <Text style={[CommonStyles.main_font_regular, { marginTop: getResponsiveSize(6) }]}>{item.listing?.region}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate(NavigationNames.ProfileTab_UserDetailScreen,
            {
              user_id: route.params?.role === 'agent' ? item.client_id : item.agent_id
            })}>
            <FastImage source={getAvatar(item)} style={[styles.userAvatar]} />
          </TouchableOpacity>
        </View>
        <Divider style={{ marginTop: 10 }} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {
        dataInfo?.totalCount === 0 ?
          <View style={[{
            marginVertical: getResponsiveSize(30),
            paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING),
          }]}>
            <Text style={[CommonStyles.main_font_bold, { fontSize: getResponsiveSize(18), textAlign: 'center' }]}>
              {getString('No Data')}
            </Text>
          </View>
          :
          <FlatList
            data={dataInfo?.list}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <Separator height={16} />}
            contentContainerStyle={styles.resultListContentContainer}
            keyExtractor={(_, index) => `propertyItemKey${index}`}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => onLoadListData(false)}
              />
            }
            onScroll={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent) && NOTIFICATION_LOAD_INFO.loadMore === false && dataInfo?.list?.length > 0 && dataInfo?.list?.length < dataInfo?.totalCount) {
                onLoadListData(true);
              }
            }}
            scrollEventThrottle={400}
          />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  resultListContentContainer: {
    paddingVertical: getResponsiveSize(20)
  },
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
  userAvatar: {
    borderRadius: getResponsiveSize(30),
    width: getResponsiveSize(50),
    height: getResponsiveSize(50),
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,

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
});

export default AppointmentScreen;

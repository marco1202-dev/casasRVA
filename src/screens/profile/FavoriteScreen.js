import React, { useState, useCallback } from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  TextInput,
  Platform
} from "react-native";
import CommonStyles from '../../styles/CommonStyles';
import { Separator, Text } from "../../components";
import {
  PAGE_LOAD_INFO,
  SCREEN_HOR_PADDING,
} from "../../constants";
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import ListingItemView from '../../components/listing/ListingItemView';
import { useLocalization } from "../../localization";

import NavigationNames from "../../navigations/NavigationNames";
import { ListingService } from "../../services";
import { Theme } from "../../theme";
import { getResponsiveSize, isCloseToBottom } from '../../utils/AppUtils';
import { LoadingManager } from '../../presentation';
import Geocoding from '../../utils/Geocoding';
import Colors from '../../styles/Colors';

const FavoriteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { getString } = useLocalization();

  const [resultInfo, setResultInfo] = useState({
    totalCount: -1,
    list: []
  });

  const [searchInfo, setSearchInfo] = useState({
    searchKey: "",
    client_id: route.params?.client_id
  });

  const onPressListingItem = (item) => {
    navigation.navigate(NavigationNames.ProfileTab_ListingDetailScreen, {
      item,
      id: item?.id
    });
  };

  const onLoadListData = (sData, isLoadMore = false) => {
    PAGE_LOAD_INFO.loadMore = true;
    if (isLoadMore === true) {
      PAGE_LOAD_INFO.pageNumber += 1;
    } else {
      PAGE_LOAD_INFO.pageNumber = 0;
    }

    sData = {
      ...sData,
      pageNumber: PAGE_LOAD_INFO.pageNumber,
      pageCount: PAGE_LOAD_INFO.pageCount
    }

    ListingService.getFavoriteList(sData)
      .then(async (res) => {
        LoadingManager.showLoading();
        let data = res.data;

        let list = data?.list ?? [];

        let newList = [];

        for (let i = 0; i < list?.length; i++) {
          if (list[i]?.region && (!list[i].latitude || !list[i].longitude)) {
            let location = await Geocoding.getLatLong(list[i]?.address + ", " + list[i]?.region);

            list[i].latitude = location.latitude;
            list[i].longitude = location.longitude;

            newList.push({
              id: list[i]?.id,
              latitude: location.latitude,
              longitude: location.longitude,
              PostalCity: list[i]?.PostalCity,
              StateOrProvince: list[i]?.StateOrProvince,
              PostalCode: list[i]?.PostalCode,
              StreetNumber: list[i]?.StreetNumber,
              StreetName: list[i]?.StreetName,
              StreetSuffix: list[i]?.StreetSuffix,
              StreetSuffixModifier: list[i]?.StreetSuffixModifier
            })
          }
        }

        if (newList?.length > 0) {
          ListingService.updateLocations(newList);
        }
        LoadingManager.hideLoading();
        setResultInfo({
          totalCount: data?.totalCount,
          list: isLoadMore ? [...resultInfo.list, ...data?.list] : [...data?.list]
        });

        setTimeout(() => {
          PAGE_LOAD_INFO.loadMore = false;
        }, 500);
      })
      .catch(err => {
        setTimeout(() => {
          PAGE_LOAD_INFO.loadMore = false;
        }, 500);
        console.log(err);
      })
  }

  useFocusEffect(
    useCallback(() => {
      onLoadListData(searchInfo);
      return () => {
        // alert('screen was unfocused')
      }
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={[CommonStyles.flex_row,
      styles.searchInputContainer, {
        marginVertical: getResponsiveSize(10),
        marginHorizontal: getResponsiveSize(SCREEN_HOR_PADDING)
      }]}>
        <TextInput
          placeholder={getString("Search Place Holder")}
          placeholderTextColor={Colors.grey}
          value={searchInfo.searchKey}
          autoFocus={!!route.params?.focusSearchInput}
          onChangeText={(val) => {
            let sInfo = searchInfo;
            sInfo.searchKey = val;
            setSearchInfo({ ...sInfo });
          }}
          style={[styles.searchInput, CommonStyles.main_font_medium, { flex: 1 }]}
        />
        <TouchableOpacity onPress={() => onLoadListData(searchInfo)} style={[{ paddingHorizontal: getResponsiveSize(12) }]}>
          <FontAwesome5Icon name='search' color={Theme.colors.primaryColor} size={getResponsiveSize(22)} />
        </TouchableOpacity>
      </View>
      {
        resultInfo.totalCount !== -1 &&
        <View style={[styles.listHeaderContainer, { paddingTop: getResponsiveSize(10) }]}>
          <Text style={styles.resultFoundText}>
            {getString("searchResultsFound", {
              count: resultInfo.totalCount,
            })}
          </Text>
          <TouchableOpacity
            style={{ alignItems: "center", flexDirection: "row" }}
            onPress={() =>
              navigation.navigate(NavigationNames.ProfileTab_SearchMapScreen, {
                resultList: resultInfo?.list,
                tab: 'profile'
              })
            }
          >
            <MaterialCommunityIcons
              name="google-maps"
              size={16}
              color={Theme.colors.primaryColorDark}
            />
            <Text
              style={{
                marginStart: 4,
                fontFamily: "rubik-medium",
                color: Theme.colors.primaryColorDark,
              }}
            >
              {getString("Map View")}
            </Text>
          </TouchableOpacity>
        </View>
      }

      <FlatList
        data={resultInfo?.list}
        renderItem={({ item }) => {
          return (
            <ListingItemView
              model={item}
              onClick={() => onPressListingItem(item)}
            />
          );
        }}
        ItemSeparatorComponent={() => <Separator height={16} />}
        contentContainerStyle={styles.resultListContentContainer}
        keyExtractor={(_, index) => `propertyItemKey${index}`}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => onLoadListData(searchInfo)}
          />
        }
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent) && PAGE_LOAD_INFO.loadMore === false && resultInfo.list?.length > 0 && resultInfo.list?.length < resultInfo.totalCount) {
            onLoadListData(searchInfo, true);
          }
        }}
        scrollEventThrottle={400}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: { flex: 1, backgroundColor: "white" },
  searchInput: {
    marginHorizontal: 16,
    marginVertical: Platform.OS === 'ios' ? 16 : 0,
    fontFamily: 'rubik-regular'
  },
  filterItemsContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  filterContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1.2,
    borderColor: Theme.colors.green,
    borderRadius: 8,
    backgroundColor: "white",
  },
  filterTitle: {
    color: Theme.colors.green,
    fontFamily: "rubik-medium",
    fontSize: 13,
  },
  filterButton: {
    backgroundColor: Theme.colors.primaryColor,
    marginEnd: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  filterButtonText: {
    fontFamily: "rubik-medium",
    fontSize: 15,
    color: "white",
  },
  searchInputContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    borderColor: Theme.colors.lightgray,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#00000010",
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  listHeaderContainer: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "space-between",
    marginHorizontal: 18,
  },
  resultFoundText: {
    fontSize: 20,
    fontFamily: "rubik-medium",
    color: Theme.colors.textColor,
  },
  resultListContentContainer: { paddingVertical: 16 },
});

export default FavoriteScreen;

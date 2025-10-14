import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useState, useEffect } from "react";
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
import DlgSearchFilterBottomSheet from '../../components/dialogs/DlgSearchFilterBottomSheet';
import { getResponsiveSize, isCloseToBottom, loadSearchInfo, saveSearchInfo } from '../../utils/AppUtils';
import Geocoding from '../../utils/Geocoding';
import { LoadingManager } from '../../presentation';
import LayoutMainView from '../../components/layouts/LayoutMainView';
import numeral from 'numeral';

let prevSearchKey = "-1";
const SearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { getString } = useLocalization();

  const [isVisibleFilterModal, setIsVisibleFilterModal] = useState(false);

  const [resultInfo, setResultInfo] = useState({
    totalCount: -1,
    list: []
  });

  const [searchInfo, setSearchInfo] = useState(null);

  const onPressListingItem = (item) => {
    navigation.navigate(NavigationNames.SearchTab_ListingDetailScreen, {
      item,
      id: item?.id
    });
  };

  const onLoadListData = async (sData, isLoadMore = false) => {
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

    ListingService.getSearchList(sData)
      .then(async (res) => {
        LoadingManager.showLoading();
        let data = res.data;


        let list = data?.list ?? [];

        let newList = [];

        for (let i = 0; i < list?.length; i++) {
          if (list[i]?.region && (!list[i].latitude || !list[i].longitude)) {
            try {
              let location = await Geocoding.getLatLong(list[i]?.address + ", " + list[i]?.region);

              if (!location.latitude) {
                continue;
              }

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
            } catch (err) {

            }
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

  useEffect(() => {
    async function fecthAndLoad() {
      let sInfo = await loadSearchInfo();

      setSearchInfo({ ...sInfo });
      await onLoadListData(sInfo);
    }

    if (searchInfo) {
      onLoadListData(searchInfo);
    } else {
      fecthAndLoad();
    }
  }, []);

  return (
    <LayoutMainView >
      <View style={styles.container}>
        <View style={[CommonStyles.flex_row,
        styles.searchInputContainer, {
          marginVertical: getResponsiveSize(10),
          marginHorizontal: getResponsiveSize(SCREEN_HOR_PADDING)
        }]}>
          <TextInput
            placeholderTextColor={Theme.colors.gray}
            placeholder={getString("Search Place Holder")}
            value={searchInfo?.searchKey}
            autoFocus={!!route.params?.focusSearchInput}
            onChangeText={(val) => {
              let sInfo = searchInfo;
              sInfo.searchKey = val;
              setSearchInfo({ ...sInfo });
            }}
            onSubmitEditing={() => {
            }}
            style={[styles.searchInput, { flex: 1 }]}
          />
          <TouchableOpacity
            disabled={!searchInfo || searchInfo?.searchKey === prevSearchKey} onPress={() => {
              onLoadListData(searchInfo);
              saveSearchInfo(searchInfo);
              prevSearchKey = searchInfo?.searchKey;
            }} style={[{ paddingHorizontal: getResponsiveSize(12) }]}>
            <FontAwesome5Icon name='search' color={!searchInfo || searchInfo?.searchKey === prevSearchKey ? Theme.colors.gray : Theme.colors.primaryColor} size={getResponsiveSize(22)} />
          </TouchableOpacity>
        </View>


        <View style={[CommonStyles.flex_row, { justifyContent: 'flex-end' }]}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setIsVisibleFilterModal(true)}
          >
            <Text style={styles.filterButtonText}>
              {getString("Filters")}
            </Text>
          </TouchableOpacity>
        </View>
        {
          resultInfo.totalCount !== -1 &&
          <View style={[styles.listHeaderContainer, { paddingTop: getResponsiveSize(10) }]}>
            <View>
              <Text style={[CommonStyles.main_font_medium, { fontSize: getResponsiveSize(18) }]}>
                {`${numeral(resultInfo.totalCount).format("0,0")} ${getString('listings')}`}
              </Text>
            </View>

            <TouchableOpacity
              style={{ alignItems: "center", flexDirection: "row" }}
              onPress={() =>
                navigation.navigate(NavigationNames.SearchMapScreen, {
                  resultList: resultInfo?.list,
                  searchInfo
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
      <DlgSearchFilterBottomSheet
        isVisible={isVisibleFilterModal}
        onChanged={(sInfo) => {
          setSearchInfo({
            ...sInfo
          });

          setIsVisibleFilterModal(false);
          onLoadListData(sInfo);
          saveSearchInfo(sInfo);
        }}
        onDismissModal={() => setIsVisibleFilterModal(false)}
      />

    </LayoutMainView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: { flex: 1, backgroundColor: "white" },
  searchInput: {
    marginHorizontal: 16,
    marginVertical: Platform.OS === 'android' ? 0 : 16,
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

export default SearchScreen;

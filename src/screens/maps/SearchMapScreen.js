import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity, View
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import numeral from 'numeral';
import FastImage from 'react-native-fast-image';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { Box, Text } from "../../components";
import PriceMarker from '../../components/markers/PriceMarker';
import { NavigationNames } from '../../navigations';
import { ListingService } from '../../services';
import { Theme } from "../../theme";
import { getMapConfig, getStatusInfo, sleep } from '../../utils/AppUtils';
import moment from "moment";

const PropertyDetail = ({ iconName, title }) => (
  <View style={styles.propertyContent}>
    <FontAwesome name={iconName} size={16} color="#aaaaaa" />
    <Text style={styles.propertyTitle}>{title}</Text>
  </View>
);

export const SearchMapScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedItem, setSelectedItem] = useState(null);

  const [loaded, setLoaded] = useState(false);

  const [dataInfo, setDataInfo] = useState({
    list: [],
    region: null
  });

  const refMap = useRef();

  useEffect(() => {
    if (route.params?.tab !== 'profile') {
      onLoadListData();
    }
  }, []);

  useEffect(() => {
    if (dataInfo.region) {
      setLoaded(true);
    }
  }, [dataInfo.region])

  const onLoadListData = () => {
    let searchInfo = route.params?.searchInfo;

    ListingService.getSearchFullList(searchInfo)
      .then(async (res) => {
        let data = res.data;
        let list = data?.list ?? [];
        let tempInitialRegion = getMapConfig(list);

        // get center and maximum, etc...
        setDataInfo({
          list: [...list],
          region: { ...tempInitialRegion }
        });
      })
      .catch(err => {
        console.log(err.message);
      })
  }
  return (
    <View style={styles.container}>
      <MapView
        ref={refMap}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={dataInfo.region}
      >
        {dataInfo.list?.map((item, index) => {

          let statusInfo = getStatusInfo(item);
          return (<Marker
            coordinate={{
              latitude: item?.latitude,
              longitude: item?.longitude
            }}
            key={`markerKey${index}`}
            onPress={() => {
              setSelectedItem({ ...item });
            }}
          >
            <PriceMarker value={item.ListPrice ?? 0} pinColor={statusInfo.color} isSelected={selectedItem?.id === item?.id}></PriceMarker>
          </Marker>)
        })}
      </MapView>

      {
        selectedItem &&
        <View style={styles.bottomView}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              if (route.params?.tab === 'profile') {
                navigation.navigate(
                  NavigationNames.ProfileTab_ListingDetailScreen,
                  { item: selectedItem, id: selectedItem?.id }
                )
                return;
              }
              navigation.navigate(
                NavigationNames.SearchTab_ListingDetailScreen,
                { item: selectedItem, id: selectedItem?.id }
              )
            }
            }
          >
            <Box style={styles.pagerItemContainer}>
              <FastImage
                source={{ uri: selectedItem?.photos?.length > 0 ? selectedItem?.photos[0] : '' }}
                style={styles.previewImage}
              />
              <View style={styles.informationRows}>
                <Text style={styles.locationText} numberOfLines={2}>
                  {selectedItem?.address}
                </Text>
                <Text style={styles.locationText} numberOfLines={2}>
                  {selectedItem?.region}
                </Text>
                <Text style={styles.priceText}>
                  {`$${numeral(selectedItem?.ListPrice).format("0,0")}`}
                </Text>
                <View style={styles.propertiesContainer}>
                  <PropertyDetail
                    iconName="bed"
                    title={String(selectedItem?.bedroom)}
                  />
                  <PropertyDetail
                    iconName="bath"
                    title={String(selectedItem?.bathroom)}
                  />
                  <View style={[styles.propertyContent]}>
                    <FontAwesome5Icon name={'ruler'} size={16} color="#aaaaaa" />
                    <Text style={styles.propertyTitle}>{numeral(selectedItem?.LivingArea).format('0,0') + ' ft2'}</Text>
                  </View>
                </View>
              </View>
            </Box>
          </TouchableOpacity>
        </View>
      }

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, height: '100%' },
  mapContainer: {

  },
  bottomView: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
  },
  pagerItemContainer: { padding: 14, flexDirection: "row", marginVertical: 8 },
  previewImage: { width: 110, height: 110, borderRadius: 8 },
  informationRows: {
    paddingStart: 16,
    justifyContent: "center",
    flex: 1,
  },
  priceText: {
    fontFamily: "rubik-medium",
    fontSize: 20,
    color: Theme.colors.primaryColorDark,
    marginTop: 8,
    textAlign: "justify",
  },
  locationText: {
    fontFamily: "rubik-medium",
    color: "black",
    opacity: 0.4,
    fontSize: 13,
    textAlign: "justify",
  },
  propertiesContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: 'space-between'
  },
  propertyContent: {
    marginStart: 4,
    marginEnd: 8,
    marginTop: 16,
    alignItems: 'center'
  },
  propertyTitle: {
    fontFamily: "rubik-medium",
    fontSize: 12,
    marginTop: 1,
    color: "#aaaaaa",
    marginHorizontal: 8,
    textAlign: "justify",
  },
});

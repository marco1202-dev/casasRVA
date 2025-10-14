import MultiSlider from "@ptomasroos/react-native-multi-slider";
import numeral from "numeral";
import React, { useEffect, useMemo, useState } from "react";
import {
  View, StyleSheet, Dimensions,
  ScrollView
} from "react-native";
import ReactNativeModal from "react-native-modal";
import SafeAreaView from "react-native-safe-area-view";
import { Divider } from "..";
import { FilterSelectorView, Text, PrimaryButton } from "..";
import {
  SEARCH_MIN_PRICE,
  SEARCH_MAX_PRICE,
  SEARCH_MIN_SIZE,
  SEARCH_MAX_SIZE,
  SCREEN_HOR_PADDING,
} from "../../constants";
import { useLocalization } from "../../localization";
import Colors from "../../styles/Colors";
import CommonStyles from "../../styles/CommonStyles";
import { Theme } from "../../theme";
import { getDefaultSearchInfo, getResponsiveSize, loadSearchInfo, saveSearchInfo } from "../../utils/AppUtils";
import Collapsible from 'react-native-collapsible';
import BtnSelect from "../buttons/BtnSelect";

const WIDTH = Dimensions.get("window").width;

const Marker = ({ value, isMoneyFormat }) => (
  <View>
    <View style={styles.markerCircle} />
    <Text style={styles.markerTitle}>
      {isMoneyFormat ? numeral(value).format("$0,0") : value}
    </Text>
  </View>
);

const DlgSearchFilterBottomSheet = (props) => {
  const { getString, currentLanguage } = useLocalization();
  const [searchInfo, setSearchInfo] = useState({});

  useEffect(() => {
    const fetch = async () => {
      let tempSearchInfo = await loadSearchInfo();
      setSearchInfo({ ...tempSearchInfo });
    }
    if (props.isVisible) {
      fetch();
    }
  }, [props.isVisible])

  const onPressReset = () => {
    let defaultSearchInfo = getDefaultSearchInfo();
    setSearchInfo({
      ...defaultSearchInfo
    });
  }

  const content = useMemo(() => {
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
        <ScrollView style={{ paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING) }}>
          <View style={[CommonStyles.flex_row]}>
            <Text style={styles.modalFilterTitle}>{getString("Price")}</Text>
            <View style={[CommonStyles.flex_row]}>
              <BtnSelect title="All" style={{ width: getResponsiveSize(80) }}
                isSelected={searchInfo?.price?.type === 'all'}
                onPress={() => {
                  let tempInfo = searchInfo;
                  if (tempInfo?.price?.type !== 'all') {
                    tempInfo.price.type = 'all';
                    setSearchInfo({
                      ...tempInfo
                    });
                  }
                }}
              />
              <BtnSelect title="Custom" style={{ width: getResponsiveSize(80) }}
                isSelected={searchInfo?.price?.type === 'custom'}
                onPress={() => {
                  let tempInfo = searchInfo;
                  if (tempInfo?.price?.type !== 'custom') {
                    tempInfo.price.type = 'custom';
                    setSearchInfo({
                      ...tempInfo
                    });
                  }
                }}
              />
            </View>
          </View>
          <Collapsible collapsed={searchInfo?.price?.type === 'all'}>
            <MultiSlider
              values={[searchInfo?.price?.minPrice, searchInfo?.price?.maxPrice]}
              sliderLength={WIDTH - 100}
              min={SEARCH_MIN_PRICE}
              max={SEARCH_MAX_PRICE}
              enabledTwo
              isMarkersSeparated
              containerStyle={{
                backgroundColor: "white",
                marginHorizontal: getResponsiveSize(SCREEN_HOR_PADDING),
                marginBottom: 8,
              }}
              onValuesChangeFinish={(values) => {

                let tempInfo = searchInfo;
                tempInfo.price.minPrice = values[0];
                tempInfo.price.maxPrice = values[1];
                setSearchInfo({
                  ...tempInfo
                });
              }}
              step={1000}
              selectedStyle={{ backgroundColor: Theme.colors.primaryColor }}
              unselectedStyle={{ backgroundColor: Theme.colors.lightgray }}
              customMarkerLeft={(e) => (
                <Marker value={e.currentValue} isMoneyFormat />
              )}
              customMarkerRight={(e) => (
                <Marker value={e.currentValue} isMoneyFormat />
              )}
            />
          </Collapsible>
          <Divider style={{ marginVertical: 12 }} />

          <View style={[CommonStyles.flex_row]}>
            <Text style={styles.modalFilterTitle}>{getString("Bedrooms")}</Text>
            <View style={[CommonStyles.flex_row]}>
              <BtnSelect title="All" style={{ width: getResponsiveSize(80) }}
                isSelected={searchInfo?.bedrooms?.type === 'all'}
                onPress={() => {
                  let tempInfo = searchInfo;
                  if (tempInfo?.bedrooms?.type !== 'all') {
                    tempInfo.bedrooms.type = 'all';
                    setSearchInfo({
                      ...tempInfo
                    });
                  }
                }}
              />
              <BtnSelect title="Custom" style={{ width: getResponsiveSize(80) }}
                isSelected={searchInfo?.bedrooms?.type === 'custom'}
                onPress={() => {
                  let tempInfo = searchInfo;
                  if (tempInfo?.bedrooms?.type !== 'custom') {
                    tempInfo.bedrooms.type = 'custom';
                    setSearchInfo({
                      ...tempInfo
                    });
                  }
                }}
              />
            </View>
          </View>
          <Collapsible collapsed={searchInfo?.bedrooms?.type === 'all'}>
            <FilterSelectorView
              items={['0', '1', '2', '3', '4+']}
              getTitle={(item) =>
                item === '0' ? getString('None') : item
              }
              selectedItems={searchInfo?.bedrooms?.values}
              style={styles.filterSelectorView}
              onClickItem={(item, isSelected) => {
                let values = searchInfo.bedrooms.values;

                let index = values.indexOf(item);
                if (index !== -1) {
                  values.splice(index, 1);
                } else {
                  values.push(item);
                }

                setSearchInfo({
                  ...searchInfo
                })

              }}
            />
          </Collapsible>
          <Divider style={{ marginVertical: 12 }} />

          <View style={[CommonStyles.flex_row]}>
            <Text style={styles.modalFilterTitle}>{getString("Bathrooms")}</Text>
            <View style={[CommonStyles.flex_row]}>
              <BtnSelect title="All" style={{ width: getResponsiveSize(80) }}
                isSelected={searchInfo?.bathrooms?.type === 'all'}
                onPress={() => {
                  let tempInfo = searchInfo;
                  if (tempInfo?.bathrooms?.type !== 'all') {
                    tempInfo.bathrooms.type = 'all';
                    setSearchInfo({
                      ...tempInfo
                    });
                  }
                }}
              />
              <BtnSelect title="Custom" style={{ width: getResponsiveSize(80) }}
                isSelected={searchInfo?.bathrooms?.type === 'custom'}
                onPress={() => {
                  let tempInfo = searchInfo;
                  if (tempInfo?.bathrooms?.type !== 'custom') {
                    tempInfo.bathrooms.type = 'custom';
                    setSearchInfo({
                      ...tempInfo
                    });
                  }
                }}
              />
            </View>
          </View>
          <Collapsible collapsed={searchInfo?.bathrooms?.type === 'all'}>
            <FilterSelectorView
              items={['0', '1', '2', '3', '4+']}
              getTitle={(item) =>
                item === '0' ? getString('None') : item
              }
              selectedItems={searchInfo?.bathrooms?.values}
              style={styles.filterSelectorView}
              onClickItem={(item, isSelected) => {
                let values = searchInfo.bathrooms.values;

                let index = values.indexOf(item);
                if (index !== -1) {
                  values.splice(index, 1);
                } else {
                  values.push(item);
                }

                setSearchInfo({
                  ...searchInfo
                })

              }}
            />
          </Collapsible>
          <Divider style={{ marginVertical: 12 }} />

          <View style={[CommonStyles.flex_row]}>
            <Text style={styles.modalFilterTitle}>{getString("Garages")}</Text>
            <View style={[CommonStyles.flex_row]}>
              <BtnSelect title="All" style={{ width: getResponsiveSize(80) }}
                isSelected={searchInfo?.garages?.type === 'all'}
                onPress={() => {
                  let tempInfo = searchInfo;
                  if (tempInfo?.garages?.type !== 'all') {
                    tempInfo.garages.type = 'all';
                    setSearchInfo({
                      ...tempInfo
                    });
                  }
                }}
              />
              <BtnSelect title="Custom" style={{ width: getResponsiveSize(80) }}
                isSelected={searchInfo?.garages?.type === 'custom'}
                onPress={() => {
                  let tempInfo = searchInfo;
                  if (tempInfo?.garages?.type !== 'custom') {
                    tempInfo.garages.type = 'custom';
                    setSearchInfo({
                      ...tempInfo
                    });
                  }
                }}
              />
            </View>
          </View>
          <Collapsible collapsed={searchInfo?.garages?.type === 'all'}>
            <FilterSelectorView
              items={['0', '1', '2', '3', '4+']}
              getTitle={(item) =>
                item === '0' ? getString('None') : item
              }
              selectedItems={searchInfo?.garages?.values}
              style={styles.filterSelectorView}
              onClickItem={(item, isSelected) => {
                let values = searchInfo.garages.values;

                let index = values.indexOf(item);
                if (index !== -1) {
                  values.splice(index, 1);
                } else {
                  values.push(item);
                }

                setSearchInfo({
                  ...searchInfo
                })
              }}
            />
          </Collapsible>
          <Divider style={{ marginVertical: 12 }} />

          <View style={[CommonStyles.flex_row]}>
            <Text style={styles.modalFilterTitle}>{getString("Living Area")}</Text>
            <View style={[CommonStyles.flex_row]}>
              <BtnSelect title="All" style={{ width: getResponsiveSize(80) }}
                isSelected={searchInfo?.livingArea?.type === 'all'}
                onPress={() => {
                  let tempInfo = searchInfo;
                  if (tempInfo?.livingArea?.type !== 'all') {
                    tempInfo.livingArea.type = 'all';
                    setSearchInfo({
                      ...tempInfo
                    });
                  }
                }}
              />
              <BtnSelect title="Custom" style={{ width: getResponsiveSize(80) }}
                isSelected={searchInfo?.livingArea?.type === 'custom'}
                onPress={() => {
                  let tempInfo = searchInfo;
                  if (tempInfo?.livingArea?.type !== 'custom') {
                    tempInfo.livingArea.type = 'custom';
                    setSearchInfo({
                      ...tempInfo
                    });
                  }
                }}
              />
            </View>
          </View>
          <Collapsible collapsed={searchInfo?.livingArea?.type === 'all'}>
            <MultiSlider
              values={[searchInfo?.livingArea?.minSize, searchInfo?.livingArea?.maxSize]}
              sliderLength={WIDTH - 80}
              min={SEARCH_MIN_SIZE}
              max={SEARCH_MAX_SIZE}
              enabledTwo
              isMarkersSeparated
              containerStyle={{
                backgroundColor: "white",
                marginHorizontal: getResponsiveSize(SCREEN_HOR_PADDING),
                marginBottom: 8,
              }}
              onValuesChangeFinish={(values) => {

                let tempInfo = searchInfo;
                tempInfo.livingArea.minSize = values[0];
                tempInfo.livingArea.maxSize = values[1];
                setSearchInfo({
                  ...tempInfo
                });
              }}
              step={1000}
              selectedStyle={{ backgroundColor: Theme.colors.primaryColor }}
              unselectedStyle={{ backgroundColor: Theme.colors.lightgray }}
              customMarkerLeft={(e) => (
                <Marker value={e.currentValue}/>
              )}
              customMarkerRight={(e) => (
                <Marker value={e.currentValue} />
              )}
            />
          </Collapsible>
          <Divider style={{ marginVertical: 12 }} />

          <View style={[CommonStyles.flex_row]}>
            <Text style={styles.modalFilterTitle}>{getString("Land")}</Text>
            <View style={[CommonStyles.flex_row]}>
              <BtnSelect title="Yes" style={{ width: getResponsiveSize(80) }}
                isSelected={searchInfo?.land === 'yes'}
                onPress={() => {
                  let tempInfo = searchInfo;
                  tempInfo.land = 'yes';
                  setSearchInfo({
                    ...tempInfo
                  });
                }}
              />
              <BtnSelect title="No" style={{ width: getResponsiveSize(80) }}
                isSelected={searchInfo?.land === 'no'}
                onPress={() => {
                  let tempInfo = searchInfo;
                  tempInfo.land = 'no';
                  setSearchInfo({
                    ...tempInfo
                  });
                }}
              />
            </View>
          </View>
          <Divider style={{ marginVertical: 12 }} />

          <View style={[CommonStyles.flex_row]}>
            <Text style={[styles.modalFilterTitle]}>{getString("For Sale")}</Text>
            <View style={[CommonStyles.flex_row]}>
              <BtnSelect title="Yes" style={{ width: getResponsiveSize(80) }}
                isSelected={searchInfo?.forSale === 'yes'}
                onPress={() => {
                  let tempInfo = searchInfo;
                  tempInfo.forSale = 'yes';
                  setSearchInfo({
                    ...tempInfo
                  });
                }}
              />
              <BtnSelect title="No" style={{ width: getResponsiveSize(80) }}
                isSelected={searchInfo?.forSale === 'no'}
                onPress={() => {
                  let tempInfo = searchInfo;
                  tempInfo.forSale = 'no';
                  setSearchInfo({
                    ...tempInfo
                  });
                }}
              />
            </View>
          </View>
          <Divider style={{ marginVertical: 12 }} />

          <View style={[CommonStyles.flex_row]}>
            <Text style={styles.modalFilterTitle}>{getString("Pending")}</Text>
            <View style={[CommonStyles.flex_row]}>
              <BtnSelect title="Yes" style={{ width: getResponsiveSize(80) }}
                isSelected={searchInfo?.pending === 'yes'}
                onPress={() => {
                  let tempInfo = searchInfo;
                  tempInfo.pending = 'yes';
                  setSearchInfo({
                    ...tempInfo
                  });
                }}
              />
              <BtnSelect title="No" style={{ width: getResponsiveSize(80) }}
                isSelected={searchInfo?.pending === 'no'}
                onPress={() => {
                  let tempInfo = searchInfo;
                  tempInfo.pending = 'no';
                  setSearchInfo({
                    ...tempInfo
                  });
                }}
              />
            </View>
          </View>
          <Divider style={{ marginVertical: 12 }} />

          <View style={[CommonStyles.flex_row]}>
            <Text style={styles.modalFilterTitle}>{getString("Sold")}</Text>
            <View style={[CommonStyles.flex_row]}>
              <BtnSelect title="Yes" style={{ width: getResponsiveSize(80) }}
                isSelected={searchInfo?.sold === 'yes'}
                onPress={() => {
                  let tempInfo = searchInfo;
                  tempInfo.sold = 'yes';
                  setSearchInfo({
                    ...tempInfo
                  });
                }}
              />
              <BtnSelect title="No" style={{ width: getResponsiveSize(80) }}
                isSelected={searchInfo?.sold === 'no'}
                onPress={() => {
                  let tempInfo = searchInfo;
                  tempInfo.sold = 'no';
                  setSearchInfo({
                    ...tempInfo
                  });
                }}
              />
            </View>
          </View>
          <Divider style={{ marginVertical: 12 }} />

        </ScrollView>
        <View style={[CommonStyles.flex_row, {
          paddingTop: getResponsiveSize(16),
          paddingBottom: getResponsiveSize(10),
          paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING)
        }]}>
          <View style={[{ flex: 1, alignItems: 'center' }]}>
            <PrimaryButton
              buttonStyle={{
                width: 200,
                backgroundColor: '#2e313a', paddingVertical: getResponsiveSize(8)
              }}
              title={getString("Reset Filters")}
              onPress={() => onPressReset()}
            />
          </View>
        </View>
        <View style={[CommonStyles.flex_row, {
          paddingVertical: getResponsiveSize(16),
          paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING)
        }]}>
          <View style={[{ flex: 1, paddingRight: getResponsiveSize(8) }]}>
            <PrimaryButton
              buttonStyle={{ backgroundColor: Colors.grey, paddingVertical: getResponsiveSize(8) }}
              title={getString("Cancel")}
              onPress={props.onDismissModal}
            />
          </View>
          <View style={[{ flex: 1, paddingRight: getResponsiveSize(8) }]}>
            <PrimaryButton
              buttonStyle={{ paddingVertical: getResponsiveSize(8) }}
              title={getString("Apply")}
              onPress={() => props.onChanged(searchInfo)}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }, [currentLanguage]);

  return (
    <ReactNativeModal
      isVisible={props?.isVisible}
      swipeDirection={null}
      style={styles.modal}
      propagateSwipe
      onSwipeComplete={props.onDismissModal}
      onBackdropPress={props.onDismissModal}
      onBackButtonPress={props.onDismissModal}
    >
      {content}
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingTop: 24,
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    height: '88%',
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalFilterTitle: {
    fontFamily: "rubik-medium",
    flex: 1,
    fontSize: 16,
    color: Theme.colors.textColor,
    paddingVertical: 6
  },
  filterSelectorView: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginTop: getResponsiveSize(10)
  },
  markerCircle: {
    width: 28,
    height: 28,
    backgroundColor: "white",
    borderColor: Theme.colors.primaryColor,
    borderWidth: 2.5,
    borderRadius: 28,
  },
  markerTitle: {
    textAlign: "center",
    fontFamily: "rubik-medium",
    color: Theme.colors.primaryColor,
    alignSelf: "center",
    position: "absolute",
    fontSize: 13,
    width: 120,
    bottom: -20,
  },
  switchContainer: {
    marginRight: getResponsiveSize(30),
    maxWidth: getResponsiveSize(200),
    shadowColor: '#222222',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 0 }
  },
});

export default DlgSearchFilterBottomSheet;

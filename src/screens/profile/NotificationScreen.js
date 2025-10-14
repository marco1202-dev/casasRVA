import React, { useCallback, useState } from "react";
import {
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity
} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonStyles from '../../styles/CommonStyles';
import { CircleIconButton, Divider, PrimaryButton, Separator, Text } from "../../components";
import {
  NOTIFICATION_LOAD_INFO,
  SCREEN_HOR_PADDING,
} from "../../constants";
import { useLocalization } from "../../localization";

import { Theme } from "../../theme";
import { getDateTimeFormat, getResponsiveSize, isCloseToBottom } from '../../utils/AppUtils';
import { NotificationService } from "../../services/NotificationService";
import ReactNativeModal from "react-native-modal";
import Colors from "../../styles/Colors";

const NotificationScreen = () => {
  const route = useRoute();

  const [dataInfo, setDataInfo] = useState({
    totalCount: -1,
    list: []
  });

  const [dlgClearInfo, setDlgClearInfo] = useState({
    show: false,
    title: '',
    item: null,
    type: 0 // 0: only one, 1: some, 2: all
  });

  const [selectedIds, setSelectedIds] = useState([]);
  const { getString } = useLocalization();

  const onLoadListData = (isLoadMore = false) => {
    NOTIFICATION_LOAD_INFO.loadMore = true;
    if (isLoadMore === true) {
      NOTIFICATION_LOAD_INFO.pageNumber += 1;
    } else {
      NOTIFICATION_LOAD_INFO.pageNumber = 0;
    }

    let data = {
      user_id: route.params?.user_id,
      pageNumber: NOTIFICATION_LOAD_INFO.pageNumber,
      pageCount: NOTIFICATION_LOAD_INFO.pageCount
    };
    NotificationService.getNotificationList(data)
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

  const onHideModal = () => {
    setDlgClearInfo({
      ...dlgClearInfo,
      show: false
    })
  }

  const onDeleteConfirm = () => {
    let type = dlgClearInfo.type;
    if (type === 0) {
      let item = dlgClearInfo.item;
      if (item) {
        let request = {
          ids: [item.id]
        };

        NotificationService.deleteNotifications(request)
          .then(res => {
            setSelectedIds([]);
            onLoadListData(false);
          })
          .catch(err => {
            console.log(err);
          })
      }
    } else if (type === 1) {
      let request = {
        ids: selectedIds
      };
      NotificationService.deleteNotifications(request)
        .then(res => {
          setSelectedIds([]);
          onLoadListData(false);
        })
        .catch(err => {
          console.log(err);
        })
    } else if (type === 2) {
      let request = {
        ids: selectedIds,
        deleteAll: true,
        user_id: route.params?.user_id
      };
      NotificationService.deleteNotifications(request)
        .then(res => {
          setSelectedIds([]);
          onLoadListData(false);
        })
        .catch(err => {
          console.log(err);
        })
    }

    onHideModal();
  }

  const onPressDeleteItems = () => {
    setDlgClearInfo({
      ...dlgClearInfo,
      type: 1,
      show: true,
      title: 'Clear Selected Items?'
    })
  }

  const onPressDeleteAll = () => {
    setDlgClearInfo({
      ...dlgClearInfo,
      title: "Clear all notifications?",
      type: 2,
      show: true
    })
  }

  const onPressSelect = (item) => {
    let index = selectedIds.indexOf(item.id);
    let tempIds = selectedIds;
    if (index < 0) {
      tempIds.push(item.id);
    } else {
      tempIds.splice(index, 1);
    }

    setSelectedIds([...tempIds]);
  }

  const onPressSelectAll = () => {
    let tempIds = [];
    if (selectedIds?.length !== dataInfo?.list?.length) {
      tempIds = dataInfo?.list.map(item => item.id);
    }

    setSelectedIds([...tempIds]);
  }

  const renderItem = ({ item, index }) => {
    return (
      <View style={{ paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING) }}>
        <View style={[CommonStyles.flex_row,]}>
          <TouchableOpacity onPress={() => onPressSelect(item)} style={{ paddingRight: getResponsiveSize(10) }}>
            <MaterialCommunityIcons
              name={selectedIds.includes(item.id) ? "checkbox-outline" : "checkbox-blank-outline"}
              size={30}
              color={Theme.colors.primaryColor}></MaterialCommunityIcons>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <View style={[CommonStyles.flex_row, { paddingBottom: getResponsiveSize(6) }]}>
              <Text numberOfLines={1} style={[CommonStyles.main_font_bold, {
                flex: 1, marginRight: getResponsiveSize(10),
                fontSize: getResponsiveSize(16),
                color: Theme.colors.primaryColor,
              }]}>{item?.title}</Text>
              <Text style={[CommonStyles.main_font_regular, {
                fontSize: getResponsiveSize(14)
              }]}>{getDateTimeFormat(item?.created_at, 'HH:mm MMM DD')}</Text>
            </View>
            <Text style={[CommonStyles.main_font_medium, { fontSize: getResponsiveSize(14) }]}>{item?.message}</Text>
          </View>
          <CircleIconButton
            iconColor={Theme.colors.primaryColor}
            iconName="close-sharp"
            iconSize={25}
            size={38}
            style={{ marginStart: 16 }}
            onPress={() => {
              setDlgClearInfo({
                ...dlgClearInfo,
                title: getString('Clear this item?'),
                show: true,
                type: 0,
                item
              })
            }}
          />
        </View>
        <Divider style={{ marginTop: 10 }} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {
        dataInfo?.list?.length > 0 &&
        <View style={[CommonStyles.flex_row,
        { paddingVertical: getResponsiveSize(10), paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING) }]}>
          <View style={[CommonStyles.flex_row, { flex: 1 }]}>
            <TouchableOpacity onPress={() => onPressSelectAll()} style={{ paddingRight: getResponsiveSize(10) }}>
              <MaterialCommunityIcons
                name={dataInfo?.list.length > 0 && dataInfo?.list.length === selectedIds?.length ? "checkbox-outline" : "checkbox-blank-outline"} size={30} color={Theme.colors.primaryColor}></MaterialCommunityIcons>
            </TouchableOpacity>
            <Text style={[CommonStyles.main_font_medium, { fontSize: getResponsiveSize(16) }]}>
              {`${selectedIds?.length} in ${dataInfo.totalCount}`}
            </Text>
          </View>
          <View style={[CommonStyles.flex_row, {
            paddingLeft: getResponsiveSize(10)
          }]}>
            <PrimaryButton
              disabled={selectedIds?.length < 1}
              buttonStyle={{
                marginRight: getResponsiveSize(12),
                paddingVertical: getResponsiveSize(6),
                paddingHorizontal: getResponsiveSize(10)
              }}
              title={getString("Clear")}
              onPress={() => onPressDeleteItems()}
            />
            <PrimaryButton
              buttonStyle={{
                paddingVertical: getResponsiveSize(6),
                paddingHorizontal: getResponsiveSize(10)
              }}
              title={getString("Clear All")}
              onPress={() => onPressDeleteAll()}
            />
          </View>

        </View>
      }
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

      <ReactNativeModal
        isVisible={dlgClearInfo.show}
        swipeDirection={null}
        style={styles.modal}
        propagateSwipe
      >
        <View style={[{
          paddingVertical: getResponsiveSize(16),
          paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING),
          backgroundColor: Colors.white,
          borderRadius: getResponsiveSize(20),
          marginBottom: getResponsiveSize(120)
        }]}>
          <Text style={[CommonStyles.main_font_medium, {
            marginTop: getResponsiveSize(20),
            fontSize: getResponsiveSize(20),
            color: Theme.colors.primaryColor,
            textAlign: 'center'
          }]}>
            {dlgClearInfo.title}
          </Text>
          <View style={[CommonStyles.flex_row, {
            marginTop: getResponsiveSize(20),
            paddingVertical: getResponsiveSize(16),
            paddingHorizontal: getResponsiveSize(16)
          }]}>
            <View style={{ flex: 1, paddingRight: getResponsiveSize(10) }}>
              <PrimaryButton
                buttonStyle={{
                  backgroundColor: Colors.cancelButtonBgColor,
                  paddingVertical: getResponsiveSize(10)
                }}
                title={getString("No")}
                onPress={() => onHideModal()}
              />
            </View>
            <View style={{ flex: 1, paddingRight: getResponsiveSize(10) }}>
              <PrimaryButton
                buttonStyle={{
                  paddingVertical: getResponsiveSize(10)
                }}
                title={getString("Yes")}
                onPress={() => onDeleteConfirm()}
              />
            </View>
          </View>
        </View>
      </ReactNativeModal>
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

export default NotificationScreen;

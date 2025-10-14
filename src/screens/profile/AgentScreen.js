import {
  useNavigation,
  useRoute
} from "@react-navigation/native";
import React from "react";
import {
  FlatList,
  Linking, StyleSheet, TouchableOpacity, View
} from "react-native";
import { Avatar, CircleIconButton, Separator, Text } from "../../components";
import {
  SCREEN_HOR_PADDING
} from "../../constants";
import { useLocalization } from "../../localization";
import CommonStyles from '../../styles/CommonStyles';

import { NavigationNames } from "../../navigations";
import { Theme } from "../../theme";
import { getResponsiveSize } from '../../utils/AppUtils';

const AgentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { getString } = useLocalization();

  const renderItem = ({ item, index }) => {
    return (
      <View style={[CommonStyles.flex_row, { paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING) }]}>
        <TouchableOpacity style={{ marginEnd: getResponsiveSize(10) }} onPress={() => {
          navigation.navigate(NavigationNames.ProfileTab_UserDetailScreen, {
            user_id: item.id
          })
        }}>
          <Avatar source={!!item?.avatar ? { uri: item?.avatar } : require('../../../assets/default-avatar.png')}
            style={{ borderRadius: 30 }}
            imageStyle={{ width: 50, height: 50 }}
          />
        </TouchableOpacity>
        <View style={styles.flex1}>
          <Text style={styles.contactName}>
            {item.name}
          </Text>
          <Text style={styles.contactAddress}>{getString('The Diaz Team')}</Text>
        </View>
        <CircleIconButton
          iconColor={Theme.colors.primaryColor}
          iconName="ios-call"
          iconSize={23}
          size={46}
          onPress={() => Linking.openURL(`tel:${item.phone}`)}
        />
        <CircleIconButton
          iconColor={Theme.colors.primaryColor}
          iconName="ios-mail"
          iconSize={25}
          size={46}
          style={{ marginStart: 16 }}
          onPress={() => Linking.openURL(`mailto:${item.email}`)}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={route.params?.agentList ?? []}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Separator height={16} />}
        contentContainerStyle={styles.resultListContentContainer}
        keyExtractor={(_, index) => `propertyItemKey${index}`}
      />
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

export default AgentScreen;

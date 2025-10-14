import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import React, { useState, useContext } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Linking,
  I18nManager,
} from "react-native";

import { Divider, TouchableHighlight, Text } from "../../components";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { useLocalization } from "../../localization";
import NavigationNames from "../../navigations/NavigationNames";
import { Theme } from "../../theme";
import DlgSettingsBottomSheet from '../../components/dialogs/DlgSettingsBottomSheet';

const getMenuItems = (
  getString
) => [
    {
      title: getString("Privacy Policy"),
      iconName: "ios-leaf",
      actionName: "privacyPolicy"
    },
    {
      title: getString("Settings"),
      iconName: "md-settings",
      actionName: "openSettings",
    },
  ];

const MenuScreen = () => {
  const navigation = useNavigation();
  const { getString } = useLocalization();
  const authContext = useContext(AuthenticationContext);

  const [appSettings, setAppSettings] = useState(null);
  const [isVisibleSettingModal, setIsVisibleSettingModal] = useState(false);
  var menuItems = getMenuItems(getString);

  if (authContext.user) {
    menuItems = [
      ...menuItems,
      {
        title: getString("Logout"),
        iconName: "md-log-out",
        actionName: "logout",
      },
    ];
  }

  const onPressMenuItemClick = async (item) => {
    if (item.actionName === "openSettings") {
      setIsVisibleSettingModal(true);
    } else if (item.actionName === "logout") {
      await authContext.logout();
      navigation.navigate(NavigationNames.RootLoginScreen);
    } else if (item.actionName === "openLink") {
      const link = appSettings[item.appSettingsKey];
      if (link) {
        Linking.openURL(link);
      }
    } else if (item.actionName === "privacyPolicy") {
      navigation.navigate(NavigationNames.PrivacyPolicyScreen);
    }
  };

  return (
    <>
      <FlatList
        data={menuItems}
        keyExtractor={(item, index) => `key${index}ForMenu`}
        renderItem={({ item }) => (
          <TouchableHighlight onPress={() => onPressMenuItemClick(item)}>
            <View style={styles.itemContainer}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={item.iconName}
                  size={24}
                  color={Theme.colors.gray}
                  style={styles.icon}
                />
              </View>
              <Text style={styles.titleText}>{item.title}</Text>
              <Ionicons
                name="ios-arrow-forward"
                size={24}
                color={Theme.colors.gray}
                style={{
                  transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                }}
              />
            </View>
          </TouchableHighlight>
        )}
        ItemSeparatorComponent={() => <Divider />}
      />
      <DlgSettingsBottomSheet
        isVisible={isVisibleSettingModal}
        onDismissModal={() => setIsVisibleSettingModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex1: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    paddingVertical: 18,
    paddingEnd: 18,
    paddingStart: 0,
  },
  iconContainer: {
    width: 60,
    alignSelf: "center",
  },
  icon: { alignSelf: "center" },
  titleText: {
    flex: 1,
    alignSelf: "center",
    color: Theme.colors.black,
    fontSize: 17,
    textAlign: "justify",
  },
});

export default MenuScreen;

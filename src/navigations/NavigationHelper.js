import Ionicons from 'react-native-vector-icons/Ionicons';
import React from "react";

import { useLocalization } from "../localization";
import { Theme } from "../theme";
import NavigationNames from "./NavigationNames";
import { View } from 'react-native';
import UnreadCount from '../screens/chats/components/UnreadCount';

const getTabTitle = (routeName) => {
  const { getString } = useLocalization();
  if (routeName === NavigationNames.HomeTab) {
    return getString("Home");
  } else if (routeName === NavigationNames.SearchTab) {
    return getString("Search");
  } else if (routeName === NavigationNames.ChatTab) {
    return getString("Chat");
  } else if (routeName === NavigationNames.ProfileTab) {
    return getString("Profile");
  } else if (routeName === NavigationNames.MenuTab) {
    return getString("Menu");
  }
  return "";
};

export const tabScreenOptions = ({ route }, totalUnreadCount) => ({
  title: getTabTitle(route.name),
  tabBarIcon: ({ focused, color, size }) => {
    let iconName = "";
    switch (route.name) {
      case NavigationNames.HomeTab:
        iconName = "ios-home";
        break;
      case NavigationNames.SearchTab:
        iconName = "ios-search";
        break;
      case NavigationNames.ChatTab:
        iconName = "chatbox";
        if (totalUnreadCount > 0) {
          return <View>
            <Ionicons name={iconName} size={28} color={color} />
            <UnreadCount count={totalUnreadCount} style={{position: 'absolute', right: -10, top: -6}}/>
          </View>;
        }
        break;
      case NavigationNames.ProfileTab:
        iconName = "md-person";
        break;
      case NavigationNames.MenuTab:
        iconName = "ios-menu";
        break;
    }
    return <Ionicons name={iconName} size={28} color={color} />;
  },
  tabBarHideOnKeyboard: true,
});

export const stackScreenOptions = {
  headerTitleAlign: "center",
  headerBackTitleVisible: false,
  headerTintColor: Theme.colors.primaryColorDark,
};

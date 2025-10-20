import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
} from "react-native";

import {
} from "../../components";
import ListingItemView from "../../components/listing/ListingItemView";
import AIChatView from "../../components/chat/AIChatView";
import HomeHeaderView from "./components/HomeHeaderView";
import { useLocalization } from "../../localization";
import NavigationNames from "../../navigations/NavigationNames";
import { DashboardService } from "../../services";
import { Theme } from "../../theme";

const HEADER_HEIGHT = 230;

const HomeScreen = (props) => {
  const { navigation } = props;
  const { getString } = useLocalization();
  const offset = new Animated.Value(0);
  const [dashboardModel, setDashboardModel] = useState(null);
  const [chatActive, setChatActive] = useState(false);
  const isFocused = useIsFocused();

  const onClickListingItem = (item) => {
    navigation.navigate(NavigationNames.HomeTab_ListingDetailScreen, {
      id: item?.id,
      item
    });
  };

  const onPropertyPress = (property) => {
    // Navigate to listing detail screen with property data
    navigation.navigate(NavigationNames.HomeTab_ListingDetailScreen, {
      id: property.id,
      item: property
    });
  };

  const onLoadListData = () => {
    DashboardService.getDashboardItems()
      .then((res) => {
        setDashboardModel(res.data);
      })
      .catch((err) => console.log(err));
  };

  useFocusEffect(
    useCallback(() => {
      onLoadListData();

      return () => {
        // alert('screen was unfocused')
      }
    }, [])
  );

  if (dashboardModel == null) {
    return null;
  }

  return (
    <View style={styles.container}>
      {!chatActive && (
        <HomeHeaderView
          animValue={offset}
          height={HEADER_HEIGHT}
          source={dashboardModel.background_image}
          onPressSearchInput={() =>
            navigation.navigate(NavigationNames.SearchTab, {
              screen: NavigationNames.SearchScreen,
              params: { focusSearchInput: true },
            })
          }
        />
      )}
      <View style={[styles.body, { paddingTop: !chatActive ? HEADER_HEIGHT + 16 : 16 }]}>
        <AIChatView
          onPropertyPress={onPropertyPress}
          style={styles.chatContainer}
          onFocusChange={setChatActive}
          isActive={isFocused}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, backgroundColor: Theme.colors.windowBackground },
  chatContainer: { flex: 1 },
});

export default HomeScreen;

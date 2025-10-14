import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";

import { Divider, Separator, Text } from "../../components";
import NavigationNames from "../../navigations/NavigationNames";
import { Theme } from "../../theme";
import { getImageUrl } from "../../utils/AppUtils";

export const NewsListScreen = () => {
  const navigation = useNavigation();
  const [news, setNews] = useState([]);

  const onClickItem = (item) => {
    navigation.navigate(NavigationNames.NewsDetailScreen, {
      model: item,
    });
  };

  return (
    <FlatList
      data={news}
      keyExtractor={(_, index) => `key${index}`}
      ItemSeparatorComponent={() => <Separator height={12} />}
      contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 12 }}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => onClickItem(item)}
            style={styles.itemContainer}
          >
            <Image
              source={{ uri: getImageUrl(item.imageName) }}
              style={styles.itemHeaderImage}
            />
            <Divider />
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitleText}>{item.title}</Text>
              <Text style={styles.itemDateText}>
                {moment(item.createdDate).format("LLL")}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "white",
    shadowColor: Theme.colors.lightgray,
    shadowOpacity: 0.6,
    shadowOffset: { height: 1, width: 0 },
    shadowRadius: 2,
    borderRadius: 12,
    elevation: 2,
  },
  itemHeaderImage: {
    height: 166,
    resizeMode: "cover",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  itemTextContainer: { paddingHorizontal: 14, paddingVertical: 12 },
  itemTitleText: {
    fontSize: 15,
    color: Theme.colors.black,
  },
  itemDateText: {
    color: Theme.colors.gray,
    fontSize: 12,
    marginTop: 4,
    fontFamily: "rubik-medium",
  },
});

import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { Theme } from "../../theme";
import { Separator } from "../divider";
import { Text } from "../text";

export const FilterSelectorView = (props) => {
  const { checkSelectedCondination, selectedItems } = props;

  return (
    <FlatList
      horizontal
      data={props.items}
      renderItem={({ item }) => {
        const isSelected = checkSelectedCondination
          ? checkSelectedCondination(selectedItems, item)
          : selectedItems?.includes(item);
        return (
          <TouchableOpacity
            onPress={() => props.onClickItem(item, isSelected)}
            style={[
              styles.item,
              isSelected
                ? {
                  backgroundColor: Theme.colors.green,
                  borderColor: Theme.colors.green,
                }
                : {
                  backgroundColor: "white",
                  borderColor: Theme.colors.lightgray,
                },
            ]}
          >
            <Text
              style={{
                color: isSelected ? "white" : "gray",
                fontSize: 14,
              }}
            >
              {props.getTitle(item)}
            </Text>
          </TouchableOpacity>
        );
      }}
      ItemSeparatorComponent={() => <Separator horizontal />}
      contentContainerStyle={[props.style]}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, index) => `itemKey${index}`}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 60,
    alignItems: "center",
  },
});

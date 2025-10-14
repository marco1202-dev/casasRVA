import React, { useCallback } from "react";

import {
    useFocusEffect,
    useNavigation,
} from "@react-navigation/native";
import {
    View,
} from "react-native";
import NavigationNames from "../../navigations/NavigationNames";
const ChatTempScreen = () => {
    const navigation = useNavigation();
    useFocusEffect(
        useCallback(() => {
            navigation.navigate(NavigationNames.HomeTab, {
                screen: NavigationNames.HomeScreen
            })

            return () => {
                // alert('screen was unfocused')
            }
        }, [])
    );

    return (
        <View></View>
    )
};

export default ChatTempScreen;

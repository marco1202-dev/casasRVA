import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../../styles/Colors";
import CommonStyles from "../../../styles/CommonStyles";
import { getResponsiveSize } from "../../../utils/AppUtils";

const UnreadCount = (props) => {
    return (
        <View style={[CommonStyles.center, styles.container, props.style]}>
            <Text style={[CommonStyles.main_font, { fontSize: getResponsiveSize(10), color: Colors.white }]}>{props.count}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        width: getResponsiveSize(20),
        height: getResponsiveSize(20),
        backgroundColor: Colors.RED7,
        shadowColor: '#222222',
        shadowOffset: { width: -2, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
        borderRadius: 20
    }
});

export default UnreadCount;
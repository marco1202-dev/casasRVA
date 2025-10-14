import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Triangle from "react-native-triangle";
import Colors from "../../styles/Colors";
import CommonStyles from "../../styles/CommonStyles";
import { Theme } from "../../theme";
import { getResponsiveSize } from "../../utils/AppUtils";

const PriceMarker = (props) => {
    const getTitle = (value) => {
        let val = parseFloat(value);
        return Math.floor(val / 1000) + "K";
    }

    return (
        <View>
            <View style={[CommonStyles.center, styles.mainContainer, { backgroundColor: (props.pinColor ?? Colors.RED7) }, props.isSelected ? styles.selectedItem : null]}>
                <Text style={[{ color: Colors.white, fontSize: getResponsiveSize(16) }]}>{getTitle(props.value)}</Text>
            </View>
            <View style={[{ alignItems: 'center' }]}>
                <Triangle
                    width={10}
                    height={6}
                    color={props.isSelected ? Colors.BLUE7 : (props.pinColor ?? Colors.RED7)}
                    direction='down'
                />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    selectedItem: {
        backgroundColor: Colors.BLUE7
    },
    mainContainer: {
        paddingVertical: getResponsiveSize(6),
        paddingHorizontal: getResponsiveSize(10),
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        borderRadius: getResponsiveSize(14),
        overflow: 'hidden'

    },
    safeAreaContainer: {
        backgroundColor: "white",
        borderTopStartRadius: 24,
        borderTopEndRadius: 24,
        minHeight: 300,
    },
    modalContainer: {
        padding: 24,
    },
    langContainer: {
        width: 36,
        height: 36,
        backgroundColor: Theme.colors.primaryColor,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        marginHorizontal: 4,
    },
    langRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    langBoxes: { flexDirection: "row" },
    langText: {
        flex: 1,
        fontFamily: "rubik-medium",
        fontSize: 15,
        color: Theme.colors.black,
    },
    langBoxTitleText: {
        color: "white",
        fontFamily: "rubik-medium",
        fontSize: 13,
    },
});

export default PriceMarker;
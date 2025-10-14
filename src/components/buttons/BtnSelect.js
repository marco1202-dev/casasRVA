import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Theme } from "../../theme";

const BtnSelect = (props) => (
    <TouchableOpacity
        onPress={props.onPress}
        style={[
            styles.langContainer,
            !props.isSelected && {
                backgroundColor: "white",
                borderColor: Theme.colors.gray,
                borderWidth: 1,
            },
            props.style
        ]}
    >
        <Text
            style={[
                styles.langBoxTitleText,
                !props.isSelected && {
                    color: Theme.colors.black,
                },
            ]}
        >
            {props.title}
        </Text>
    </TouchableOpacity>
);


const styles = StyleSheet.create({
    modal: {
        justifyContent: "flex-end",
        margin: 0,
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

export default BtnSelect;

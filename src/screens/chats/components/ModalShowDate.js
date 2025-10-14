import React, { useEffect, useState } from "react";
import {
    Animated, View,
    Text,
    StyleSheet,
    Easing
} from 'react-native';
import CommonStyles from "../../../styles/CommonStyles";
import { getResponsiveSize } from "../../../utils/AppUtils";

const ModalShowDate = (props) => {
    const [topVal] = useState(new Animated.Value(-60));

    useEffect(() => {
        if (props.isShow) {
            Animated.timing(topVal, {
                duration: 200,
                easing: Easing.linear,
                toValue: 4,
                useNativeDriver: true,
            }).start();
        } else {
            setTimeout(() => {
                Animated.timing(topVal, {
                    duration: 200,
                    easing: Easing.linear,
                    toValue: -60,
                    useNativeDriver: true,
                }).start();
            }, 2000);
        }
    }, [props.isShow]);

    return (
        <Animated.View style={[styles.container, CommonStyles.center, { transform: [{ translateY: topVal }] }]}>
            <View style={[styles.mainContainer]}>
                <Text style={[CommonStyles.main_font]}>{props.date}</Text>
            </View>
        </Animated.View>
    )
};


const styles = StyleSheet.create({
    container: {
        shadowColor: '#222222',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
        position: 'absolute',
        zIndex: 1,
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
    },
    mainContainer: {
        backgroundColor: '#DDDDDD',
        opacity: 0.8,
        paddingHorizontal: getResponsiveSize(10),
        paddingVertical: getResponsiveSize(6),
        borderRadius: getResponsiveSize(20),
    }
});

export default ModalShowDate;
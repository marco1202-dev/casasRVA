import React, { useEffect, useState } from 'react';

import {
    Animated, StyleSheet, Text,
    TouchableOpacity, View,
    Easing
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import CommonStyles from '../../styles/CommonStyles';
import { getResponsiveSize } from '../../utils/AppUtils';
import Colors from '../../styles/Colors';
import { SCREEN_HOR_PADDING } from '../../constants';

const DlgSelectFileType = (props) => {

    const [opacity] = useState(new Animated.Value(0));
    const [ended, setEnded] = useState(false);

    useEffect(() => {
        if (props.show) {
            setEnded(false);
            onShow();
        } else {
            onHide();
        }
    }, [props.show]);

    const onShow = () => {
        Animated.timing(opacity, {
            duration: 200,
            easing: Easing.linear,
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const onHide = () => {
        Animated.timing(opacity, {
            duration: 200,
            easing: Easing.linear,
            toValue: 0,
            useNativeDriver: true,
        }).start(() => {
            setEnded(true);
        });
    };

    return (
        ended === false ?
            <Animated.View style={[styles.container, CommonStyles.center, { opacity: opacity }]} activeOpacity={1}
                onTouchEnd={() => props.onHide()}
                underlayColor={'#0000004C'}
            >
                <Animated.View style={{
                    marginHorizontal: getResponsiveSize(24),
                    backgroundColor: Colors.white,
                    paddingVertical: getResponsiveSize(10),
                    alignSelf: 'stretch',
                    borderRadius: getResponsiveSize(10),
                    marginBottom: getResponsiveSize(100),
                    overflow: 'hidden',
                    opacity: opacity
                }}>
                    <TouchableOpacity onPress={() => props.onSelect('library')} style={[CommonStyles.flex_row,
                    {
                        paddingHorizontal: getResponsiveSize(16),
                        paddingVertical: getResponsiveSize(12)
                    }]}>
                        <FontAwesome5Icon name="image" size={getResponsiveSize(24)} />
                        <Text style={[CommonStyles.main_font_medium, { marginHorizontal: getResponsiveSize(12), flex: 1 }]}>Open Libray</Text>
                        <FontAwesome5Icon name="arrow-right" size={getResponsiveSize(18)} />
                    </TouchableOpacity>
                    <View style={{
                        height: 1,
                        backgroundColor: Colors.pinkishGrey,
                        marginHorizontal: getResponsiveSize(16),
                    }} />

                    <TouchableOpacity onPress={() => props.onSelect('camera')} style={[CommonStyles.flex_row,
                    {
                        paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING),
                        paddingVertical: getResponsiveSize(12)
                    }]}>
                        <FontAwesome5Icon name="camera-retro" size={getResponsiveSize(24)} />
                        <Text style={[CommonStyles.main_font_medium, { marginHorizontal: getResponsiveSize(12), flex: 1 }]}>Open Camera</Text>
                        <FontAwesome5Icon name="arrow-right" size={getResponsiveSize(18)} />
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
            : null
    )
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#0000004c",
        zIndex: 10000
    },
    
    
    
});

export default DlgSelectFileType;

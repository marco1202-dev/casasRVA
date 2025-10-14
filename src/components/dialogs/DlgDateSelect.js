import React, { useState, useEffect } from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Easing
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Colors from '../../styles/Colors';
import CommonStyles from '../../styles/CommonStyles';
import { Theme } from '../../theme';
import { getResponsiveSize } from '../../utils/AppUtils';

const DlgDateSelect = (props) => {

    const [opacity] = useState(new Animated.Value(0));
    const [ended, setEnded] = useState(false);

    const [pickerVal, setPickerVal] = useState(new Date());

    useEffect(() => {
        if (props.isOpen) {
            setEnded(false);
            setPickerVal(props.pickerVal ?? new Date());
            onShow();
        } else {
            onHide();
        }
    }, [props.isOpen]);

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
            <Animated.View style={[styles.container, styles.center, { opacity: opacity }]} activeOpacity={1} underlayColor={'#0000004C'} onTouchEnd={props.onPressCancel}>
                <Animated.View style={{
                    marginHorizontal: 20, backgroundColor: Colors.white, paddingTop: 4, alignSelf: 'stretch',
                    borderRadius: 10, overflow: 'hidden',
                    opacity: opacity
                }}>
                    {
                        props.title &&
                        <View style={[CommonStyles.center, styles.titleContainer]}>
                            <Text style={[CommonStyles.main_font_bold, { fontSize: getResponsiveSize(20) }]}>{props.title}</Text>
                        </View>
                    }

                    <View style={[CommonStyles.center, styles.datePickerContainer]}>
                        <DatePicker
                            modal={false}
                            textColor={Theme.colors.black}
                            fadeToColor={Theme.colors.black}
                            mode={props.mode ?? "datetime"}
                            theme="light"
                            date={pickerVal}
                            onDateChange={(date) => {
                                setPickerVal(date);
                            }}
                            androidVariant="iosClone"
                        />
                    </View>

                    <View style={[CommonStyles.flex_row, styles.buttonContainer]}>
                        <View style={[CommonStyles.center, { flex: 1, paddingHorizontal: getResponsiveSize(10) }]}>
                            <TouchableOpacity onPress={() => props.cancelAction()} style={[CommonStyles.center, styles.button, { backgroundColor: Colors.cancelButtonBgColor }]}>
                                <Text style={[CommonStyles.main_font_medium, { color: Colors.confirmButtonFontColor }]}>
                                    {props.cancelTitle ?? "Cancel"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[CommonStyles.center, { flex: 1, paddingHorizontal: getResponsiveSize(10) }]}>
                            <TouchableOpacity onPress={() => props.confirmAction(pickerVal)} style={[CommonStyles.center, styles.button, { backgroundColor: Colors.confirmButtonBgColor }]}>
                                <Text style={[CommonStyles.main_font_medium, { color: Colors.confirmButtonFontColor }]}>
                                    {props.confirmTitle ?? "Confirm"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
    },

    imageContainer: {
        paddingVertical: getResponsiveSize(16)
    },
    titleContainer: {
        paddingTop: getResponsiveSize(20),
        paddingHorizontal: getResponsiveSize(10),
        paddingBottom: getResponsiveSize(10)
    },
    datePickerContainer: {
        paddingHorizontal: getResponsiveSize(16)
    },
    shadow: {
        shadowColor: '#aaa',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        paddingHorizontal: getResponsiveSize(10),
        paddingBottom: getResponsiveSize(20)
    },
    button: {
        paddingVertical: getResponsiveSize(8),
        width: '100%',
        borderRadius: getResponsiveSize(6)
    }
});


export default DlgDateSelect;

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import CommonStyles from '../../styles/CommonStyles';
import { getResponsiveSize } from '../../utils/AppUtils';
import Colors from '../../styles/Colors';
import { getAvatarBgColor} from '../../utils/ChatUtils';
import FastImage from 'react-native-fast-image';
const ChatUserAvatar = (props) => {
    const getFirstCharacter = (name) => {
        if (!name) {
            return '?';
        }

        let newName = name.toString().toUpperCase();
        return newName[0]
    };

    let charactor = getFirstCharacter(props.name);

    const getStatusColor = (mobileStatus) => {
        let color = Colors.coolGrey2;
        if (mobileStatus === 1) {   
            color = '#15CE33'
        } else if (mobileStatus === 2) {
            color = Colors.YELLOW8;
        }

        return color;
    }

    return (
        <View style={[styles.container]}>

            <View style={[CommonStyles.center,
            {
                width: props.size ?? getResponsiveSize(38),
                height: props.size ?? getResponsiveSize(38),
                borderRadius: props.size ? (props.size / 2) : getResponsiveSize(20),
                borderColor: Colors.coolGrey2,
                borderWidth: getResponsiveSize(1),
                overflow: 'hidden',
                backgroundColor: getAvatarBgColor(charactor)
            }]}>
                {
                    props.picture ?
                        <FastImage source={typeof props.picture === 'string' ? { uri: props.picture } : undefined} style={{ width: '100%', height: '100%' }} />
                        :
                        <Text style={[CommonStyles.main_font_bold, { fontSize: getResponsiveSize(20), color: Colors.white }]}>{charactor}</Text>
                }
            </View>
            <View style={[styles.activeSymbol, {
                backgroundColor: getStatusColor(props.mobileStatus),
                right: props.size ? (props.size / 2) * (1 - Math.cos(30 * 3.14 / 180)) : getResponsiveSize(19) * (1 - Math.cos(30 * 3.14 / 180)),
                zIndex: 2
            }]} />
        </View>

    )
};

const styles = StyleSheet.create({
    container: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    activeSymbol: {
        position: 'absolute',
        bottom: getResponsiveSize(1),
        width: getResponsiveSize(8),
        height: getResponsiveSize(8),
        shadowColor: '#222222',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        borderRadius: getResponsiveSize(4),
        shadowRadius: 2,
        elevation: 4,
    },
    flex: {
        flex: 1
    }
});

export default ChatUserAvatar;
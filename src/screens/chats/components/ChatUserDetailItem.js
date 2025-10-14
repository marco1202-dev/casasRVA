import React from 'react';
import {
    StyleSheet, Text,
    View,
} from 'react-native';

import CommonStyles from '../../../styles/CommonStyles';
import { getDateTimeFormat, getResponsiveSize, getScreenWidth } from '../../../utils/AppUtils';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../../../styles/Colors'

import Triangle from 'react-native-triangle';
import ChatUserAvatar from '../../../components/avatar/ChatUserAvatar';

const maxWidth = getScreenWidth() * 0.64;
const minWidth = getResponsiveSize(60);

const ChatDetailItem = (props) => {
    const { item } = props;

    const getStatusInfo = (status) => {
        let bgColor = Colors.buttonBgColor;
        let name = "check-all";
        let size = 20;
        if (status === 0) {
            bgColor = '#878978';
            name = 'timer-outline';
        } else if (status === 1) {
            name = "check";
        } else if (status === 2) {
            name = "check-all";
        }

        return {
            bgColor,
            name,
            size
        }
    };

    let statusInfo = getStatusInfo(item?.read_status);

    let direction = props.userInfo?.role === 'client' ? item.direction : !item.direction;

    return (
        direction > 0 ?
            <View style={[{
                marginBottom: props.showTime ? getResponsiveSize(15) : 0
            }]}>
                <View style={[CommonStyles.flex_row_end]}>
                    <View style={[CommonStyles.flex_row, { width: getResponsiveSize(42) }]}>
                        {
                            !!props.showUser &&
                            <ChatUserAvatar picture={props.otherUserInfo?.avatar}
                                mobileStatus={props.otherUserInfo?.mobile_status}
                                name={props.otherUserInfo?.name}
                                style={{
                                    marginTop: getResponsiveSize(-8)
                                }} />
                        }
                    </View>
                    <View style={[CommonStyles.flex_row_end]}>
                        {
                            props.showUser ?
                                <Triangle
                                    width={8}
                                    height={10}
                                    color={'#E3F4F3'}
                                    direction='down-right'
                                />
                                : <View style={{ width: 8 }} />
                        }
                        <View>
                            <View style={[styles.mainContainer, CommonStyles.flex_row_start, styles.receivedContainer, props.showUser && styles.borderBottomLeftZero, item?.type === 2 && !!item.path && styles.imageBorder]}>
                                <View style={{ paddingHorizontal: getResponsiveSize(14), maxWidth, minWidth }}>
                                    <Text style={[CommonStyles.main_font]}>
                                        {item?.content}
                                    </Text>
                                </View>
                                {
                                    props.showTime &&
                                    <View style={[styles.receivedTimeInfo]}>
                                        <Text style={[CommonStyles.main_font, { color: Colors.coolGrey, fontSize: getResponsiveSize(12) }]}>{getDateTimeFormat(item.created_at, 'HH:mm')}</Text>
                                    </View>
                                }
                            </View>
                        </View>

                    </View>
                </View>
            </View>
            :
            <View style={[CommonStyles.flex_row, { justifyContent: 'flex-end' }]}>
                <View style={[]}>
                    <View style={[CommonStyles.flex_row_end]}>
                        <View>
                            <View style={[styles.mainContainer, styles.sentContainer, props.showUser && styles.borderBottomEndZero, item?.type === 2 && !!item.path && styles.imageBorder]}>
                                <View style={[CommonStyles.flex_row_start]}>
                                    <View style={{ paddingHorizontal: getResponsiveSize(14), maxWidth, minWidth }}>

                                        <Text style={[CommonStyles.main_font]}>
                                            {item?.content}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {
                            props.showUser ?
                                <Triangle
                                    width={8}
                                    height={10}
                                    color={'#F4F4F4'}
                                    direction='down-left'
                                />
                                : <View style={{ width: 8 }} />
                        }
                    </View>
                    {
                        props.showTime === true &&
                        <View style={[CommonStyles.flex_row, { justifyContent: 'flex-end', marginRight: 8 }]}>
                            <Text style={[CommonStyles.main_font, { color: Colors.coolGrey, fontSize: getResponsiveSize(12) }]}>{getDateTimeFormat(item.created_at, 'HH:mm')}</Text>
                            <MaterialCommunityIcons
                                name={statusInfo.name}
                                style={{ marginLeft: getResponsiveSize(10) }}
                                color={statusInfo.bgColor} size={statusInfo.size} />
                        </View>
                    }
                </View>

            </View>
    )
};

const styles = StyleSheet.create({
    container: {
        minWidth: 100
    },
    mainContainer: {
        paddingVertical: getResponsiveSize(12),
    },
    sentContainer: {
        backgroundColor: '#F4F4F4',
        borderRadius: getResponsiveSize(10),
    },
    receivedContainer: {
        backgroundColor: '#E3F4F3',
        borderRadius: getResponsiveSize(10),
    },
    borderBottomLeftZero: {
        borderBottomLeftRadius: 0
    },
    borderBottomEndZero: {
        borderBottomEndRadius: 0
    },
    receivedTimeInfo: {
        position: "absolute",
        right: 0,
        bottom: getResponsiveSize(-16)

    },
    imageBorder: {
        borderTopLeftRadius: 0,
        borderTopEndRadius: 0
    },
    imageWrapper: {
        borderTopLeftRadius: getResponsiveSize(10),
        borderTopEndRadius: getResponsiveSize(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.coolGrey,
        overflow: 'hidden'
    }
});

export default ChatDetailItem;

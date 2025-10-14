import {
    useFocusEffect,
    useNavigation,
} from "@react-navigation/native";
import React, { useCallback, useContext, useEffect } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Text,
    RefreshControl
} from "react-native";
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import CommonStyles from '../../styles/CommonStyles';
import { Divider, Separator } from "../../components";
import {
    SCREEN_HOR_PADDING,
} from "../../constants";
import { useLocalization } from "../../localization";

import { Theme } from "../../theme";
import { getDateTimeFormat, getResponsiveSize } from '../../utils/AppUtils';
import ChatUserAvatar from "../../components/avatar/ChatUserAvatar";
import NavigationNames from "../../navigations/NavigationNames";
import { ChatService } from "../../services/ChatService";
import Global from "../../utils/Global";
import { SocketConext } from "../../context/SocketContext";
import Colors from "../../styles/Colors";
import UnreadCount from "./components/UnreadCount";
const ChatUserListScreen = () => {
    const navigation = useNavigation();
    const { getString } = useLocalization();

    const { socket, chatInfo, setChatInfo, logout } = useContext(SocketConext);

    const onLoadListData = () => {
        ChatService.getChatUserList()
            .then(res => {
                let data = res.data;
                if (data?.error === 'LOGOUT') {
                    logout();
                    navigation.navigate(NavigationNames.RootLoginScreen);
                } else {
                    Global.chatInfo.chatList = data?.list ?? [];
                    setChatInfo({ ...Global.chatInfo });
                }
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    const onChangedUserStatus = useCallback((data) => {

        let otherUserId = data.id;
        let status = data.status ?? 0;

        Global.chatInfo.chatList?.forEach(item => {
            if (item.id === otherUserId) {
                item.mobile_status = status;
            }
        });

        setChatInfo({ ...Global.chatInfo });

    }, []);

    useFocusEffect(
        useCallback(() => {
            onLoadListData();
        }, [])
    )

useEffect(() => {
    socket?.on('changed_user_status', onChangedUserStatus);

    return () => {
        socket?.off('changed_user_status', onChangedUserStatus);
    }
}, []);

const onPressItem = (item) => {
    Global.chatInfo.detailInfo.otherUserId = item?.id;
    Global.chatInfo.detailInfo.list = [];
    setChatInfo({
        ...Global.chatInfo
    });

    navigation.navigate(NavigationNames.ChatTab_ChatDetailScreen, { item })
}

const renderItem = ({ item, index }) => {
    return (
        <TouchableOpacity onPress={() => onPressItem(item)}>
            <View style={[CommonStyles.flex_row, { paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING) }]}>
                <View style={{ marginEnd: getResponsiveSize(10) }}>
                    <ChatUserAvatar picture={item?.avatar} name={item.name} mobileStatus={item.mobile_status} />
                </View>
                <View style={[styles.flex1, { marginRight: getResponsiveSize(20) }]}>
                    <View style={[CommonStyles.flex_row]}>
                        <Text numberOfLines={1} style={[CommonStyles.main_font_medium, styles.contactName]}>
                            {item.name}
                        </Text>
                        {item?.unReadCount > 0 &&
                            <UnreadCount count={item?.unReadCount} />}
                    </View>

                    <View style={[CommonStyles.flex_row]}>
                        {
                            item?.typingFlag ?
                                <Text numberOfLines={1} style={[CommonStyles.main_font_regular, styles.contactAddress, { flex: 1 }]}>{item?.name + " " + getString('is typing...')}</Text>
                                :
                                <Text numberOfLines={1} style={[CommonStyles.main_font_regular, styles.contactAddress, { flex: 1 }]}>{item.lastChatInfo ? item.lastChatInfo.content : getString('No chat')}</Text>
                        }
                        {
                            item.lastChatInfo &&
                            <Text style={[CommonStyles.main_font_regular, styles.contactAddress]}>{getDateTimeFormat(item.lastChatInfo?.created_at, 'HH:mm')}</Text>
                        }
                    </View>
                </View>
                <FontAwesome5Icons name="arrow-right" color={Theme.colors.primaryColor} size={getResponsiveSize(24)} />
            </View>
            <Divider style={{ marginTop: getResponsiveSize(8) }} />
        </TouchableOpacity>
    )
}

return (
    <View style={styles.container}>
        <FlatList
            data={chatInfo?.chatList}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <Separator height={16} />}
            contentContainerStyle={styles.resultListContentContainer}
            keyExtractor={(_, index) => `propertyItemKey${index}`}
            refreshControl={
                <RefreshControl
                    refreshing={false}
                    onRefresh={() => onLoadListData()}
                />
            }
        />
    </View>
);
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    resultListContentContainer: {
        paddingVertical: getResponsiveSize(20)
    },
    flex1: { flex: 1 },
    headerView: { backgroundColor: "white" },
    headerDivider: { position: "absolute", bottom: 0, left: 0, right: 0 },
    scrollView: { flex: 1, backgroundColor: "white" },
    scrollViewContainer: { paddingBottom: 24 },
    moneyContainer: {
        marginTop: 8,
        paddingVertical: 8,
        paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING),
    },
    moneyTitle: {
        fontFamily: "rubik-medium",
        color: Theme.colors.primaryColorDark,
    },
    moneyText: {
        color: Theme.colors.textColor,
        fontSize: 24,
        fontFamily: "rubik-medium",
        paddingVertical: 8,
        textAlign: "justify",
    },
    mlsidText: {
        color: Theme.colors.gray,
        fontSize: 18,
        fontFamily: "rubik-medium",
        paddingVertical: 8,
        textAlign: "justify",
    },
    monthlyText: { fontSize: 14, color: "gray", textAlign: "justify" },
    propertiesContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16,
        alignItems: "center",
        alignContent: "center",
    },
    propertyContent: {
        alignItems: "center",
        justifyContent: "center",
    },
    propertyTitle: {
        fontSize: 12,
        marginTop: 8,
        color: "gray",
    },
    previewImages: { marginHorizontal: -16 },
    previewImagesContainer: { paddingVertical: 8, paddingHorizontal: 16 },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: Theme.sizes.boxBorderRadius,
    },
    propertyDetailRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
    },
    propertyDetailTitle: {
        fontSize: 15,
        marginStart: 12,
        color: Theme.colors.textColor,
    },
    unreadWrapper: {
        backgroundColor: Colors.RED7,
        width: getResponsiveSize(24),
        height: getResponsiveSize(24),
        borderRadius: getResponsiveSize(16)
    },
    mapViewContainer: {
        borderRadius: Theme.sizes.boxBorderRadius,
        overflow: "hidden",
    },
    mapView: {
        borderRadius: Theme.sizes.boxBorderRadius,
        height: 180,
    },
    contactContent: {
        flexDirection: "row",
    },
    contactName: {
        fontSize: getResponsiveSize(16),
        color: Theme.colors.primaryColorDark,
        marginRight: getResponsiveSize(10)
    },
    contactAddress: {
        fontSize: 13,
        color: "gray",
        marginTop: 4,
    },
    sectionChildrenContent: {
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 8,
    },
});

export default ChatUserListScreen;

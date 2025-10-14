import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList
} from 'react-native';

import NavigationNames from "../../navigations/NavigationNames";

import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../styles/Colors';
import CommonStyles from '../../styles/CommonStyles';

import { getDateTimeFormat, getResponsiveSize, isCloseToBottom, isCloseToTop } from '../../utils/AppUtils';

import ChatUserDetailItem from './components/ChatUserDetailItem';
import moment from 'moment';

import ChatUserAvatar from '../../components/avatar/ChatUserAvatar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CHAT_LOAD_INFO, SCREEN_HOR_PADDING } from '../../constants';
import ModalShowDate from './components/ModalShowDate';
import { Theme } from '../../theme';
import { Divider } from '../../components';
import { AuthenticationContext } from '../../context/AuthenticationContext';
import { useLocalization } from '../../localization';
import { SocketService } from '../../services/SocketService';
import { ChatService } from '../../services/ChatService';
import { SocketConext } from '../../context/SocketContext';
import Global from '../../utils/Global';
import UnreadCount from './components/UnreadCount';
import LayoutMainView from '../../components/layouts/LayoutMainView';

var typing = false;
var timeout = undefined;

const ChatDetailScreen = (props) => {

    const navigation = useNavigation();
    const route = useRoute();
    const { logout, user } = useContext(AuthenticationContext);
    const { socket, chatInfo, setChatInfo } = useContext(SocketConext);
    const { getString } = useLocalization();

    const detailInfo = chatInfo?.detailInfo;
    const flatlistRef = useRef();
    const [showToDown, setShowToDown] = useState(false);

    const [otherUserInfo, setOtherUserInfo] = useState(route.params?.item ?? null);

    const [showModalDate, setShowModalDate] = useState(false);
    const [dateVal, setDateVal] = useState('');

    const [selectedMessage, setSelectedMessage] = useState('');

    const onChangedUserStatus = useCallback((data) => {
        let id = data.id;
        let status = data.status ?? 0;

        if (otherUserInfo?.id === id) {
            setOtherUserInfo({
                ...otherUserInfo,
                mobile_status: status
            })
        }
    }, []);

    const getStatusTitle = (mobileStatus) => {
        let title = getString('Offline');
        if (mobileStatus === 1) {
            title = getString('Active Now');
        } else if (mobileStatus === 2) {
            title = getString('Inactive');
        }

        return title;
    }

    useEffect(() => {
        onLoadListData(false);
        socket?.on('changed_user_status', onChangedUserStatus);

        return () => {
            socket?.off('changed_user_status', onChangedUserStatus);
        }
    }, []);

    const onLoadListData = (isLoadMore = false) => {
        CHAT_LOAD_INFO.loadMore = true;
        if (isLoadMore === true) {
            CHAT_LOAD_INFO.pageNumber += 1;
        } else {
            CHAT_LOAD_INFO.pageNumber = 0;
            CHAT_LOAD_INFO.firstId = 0;
        }

        let sData = {
            user_id: user?.id,
            role: user?.role,
            other_id: otherUserInfo?.id,
            firstId: CHAT_LOAD_INFO.firstId,
            pageNumber: CHAT_LOAD_INFO.pageNumber,
            pageCount: CHAT_LOAD_INFO.pageCount
        }

        ChatService.getChatHistory(sData)
            .then(async (res) => {

                let data = res?.data;
                if (data?.error === 'LOGOUT') {
                    logout();
                    navigation.navigate(NavigationNames.RootLoginScreen);
                    return;
                }

                let totalCount = data?.totalCount;
                let list = data?.list ?? [];

                if (data.firstId) {
                    CHAT_LOAD_INFO.firstId = data?.firstId ?? 0;
                }

                if (isLoadMore) {
                    list = [...detailInfo?.list, ...list];
                    Global.chatInfo.detailInfo = {
                        ...Global.chatInfo.detailInfo,
                        totalCount,
                        list,
                        unReadCount: data?.unReadCount ?? 0
                    }
                } else {
                    Global.chatInfo.detailInfo = {
                        ...Global.chatInfo.detailInfo,
                        totalCount,
                        list,
                        unReadCount: data?.unReadCount ?? 0
                    }
                }

                setChatInfo({ ...Global.chatInfo });

                setTimeout(() => {
                    CHAT_LOAD_INFO.loadMore = false;
                }, 500);
            })
            .catch(err => {
                setTimeout(() => {
                    CHAT_LOAD_INFO.loadMore = false;
                }, 500);
                console.log(err);
            })
    }

    const onViewItems = useCallback(({ viewableItems }) => {
        let lastItem = viewableItems?.reverse().find(item => item.isViewable === true);
        if (lastItem) {
            let lastDate = getDateTimeFormat(lastItem?.item.created_at, 'MMM DD, yyyy');

            if (lastDate !== dateVal) {
                setDateVal(lastDate);
            }
        }
    }, []);

    const onGotoDown = () => {
        flatlistRef.current.scrollToOffset({ animated: true, offset: 0 });
    }

    const getSendInfo = () => {
        let item = {};
        item.role = user?.role;

        if (user?.role === 'client') {
            item.client_id = user?.id;
            item.agent_id = otherUserInfo?.id
        } else {
            item.agent_id = user?.id;
            item.client_id = otherUserInfo?.id
        }

        return item;
    }

    const onSendMessage = () => {
        if (!selectedMessage) {
            return;
        }

        let item = getSendInfo();
        item.content = selectedMessage;

        // SocketService.
        SocketService.sendMessage(item);
        setSelectedMessage('');
        // Keyboard.dismiss();
    }

    const timeoutFunc = () => {
        typing = false;
        let item = getSendInfo();
        SocketService.sendTypingStatus(item, true);
    }

    const onChangeText = (val) => {
        setSelectedMessage(val);

        if (typing === false) {
            typing = true;

            onSendFocusInfo();

            let item = getSendInfo();

            SocketService.sendTypingStatus(item, false);
            timeout = setTimeout(timeoutFunc, 2000);
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFunc, 2000);
        }
    }

    const checkSameInfo = (item, index) => {

        let res = {
            sameChat: false,
            sameDate: false,
            sameTime: false
        };

        if (index < detailInfo?.list.length - 1) {
            let nextItem = detailInfo?.list[index + 1];

            if (getDateTimeFormat(item.created_at, 'yyyy-MM-DD') === getDateTimeFormat(nextItem.created_at, 'yyyy-MM-DD')) {
                res.sameDate = true;
            }
        }

        if (index > 0) {
            let prevItem = detailInfo?.list[index - 1];

            if (item.direction === prevItem.direction) {
                let diff = moment(prevItem.created_at).diff(moment(item.created_at), 'minutes');
                if (diff < 2) {
                    res.sameChat = true;
                }
            }

            if (item.direction === prevItem.direction
                && getDateTimeFormat(item.created_at, 'yyyy-MM-DD HH:mm') === getDateTimeFormat(prevItem.created_at, 'yyyy-MM-DD HH:mm')) {
                res.sameTime = true;
            }
        }

        return res;
    };

    const onSendFocusInfo = () => {

        if (detailInfo?.unReadCount < 1 || detailInfo?.list?.length < 1) {
            return;
        }

        let item = getSendInfo();
        item.last_id = detailInfo?.list[0]?.id;
        SocketService.sendFocusStatus(item);
    }

    const renderChatContentItem = ({ item, index }) => {
        let sameInfo = checkSameInfo(item, index);
        return (
            <View key={index} style={{ paddingTop: getResponsiveSize(4) }}>
                {
                    !sameInfo.sameDate &&
                    <View style={[CommonStyles.flex_row, { paddingVertical: getResponsiveSize(14) }]}>
                        <View style={{
                            flex: 1, height: getResponsiveSize(1),
                            marginHorizontal: getResponsiveSize(10),
                            borderRadius: getResponsiveSize(1),
                            backgroundColor: Colors.coolGrey
                        }} />
                        <Text style={[CommonStyles.main_font, { color: Colors.coolGrey, paddingHorizontal: getResponsiveSize(10) }]}>{getDateTimeFormat(item.created_at, 'MMM DD, yyyy')}</Text>
                        <View style={{
                            flex: 1, height: getResponsiveSize(1),
                            marginHorizontal: getResponsiveSize(10),
                            borderRadius: getResponsiveSize(1),
                            backgroundColor: Colors.coolGrey
                        }} />
                    </View>
                }

                <ChatUserDetailItem item={item}
                    otherUserInfo={otherUserInfo}
                    userInfo={user}
                    showTime={!sameInfo.sameTime}
                    showUser={!sameInfo.sameChat}
                    onPressAction={() => { }}
                    onShowImage={() => { }}
                />
            </View>
        )
    }

    return (
        <LayoutMainView isAvoid={true}>
            <StatusBar barStyle={'dark-content'} />

            {/* header with tab */}
            <View style={styles.headerContainer}>
                <View style={[CommonStyles.flex_row, {
                    paddingVertical: getResponsiveSize(12),
                    paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING),
                    justifyContent: 'space-between'
                }]}>
                    <View style={{ width: getResponsiveSize(40) }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.goBack();
                            }}
                        >
                            <AntDesignIcons name='arrowleft' size={getResponsiveSize(28)} color={Theme.colors.primaryColor} />
                        </TouchableOpacity>
                    </View>
                    <View style={[CommonStyles.flex_row, { flex: 1 }]}>
                        <View style={{ paddingRight: getResponsiveSize(6) }}>
                            <ChatUserAvatar picture={otherUserInfo?.avatar}
                                style={{ marginRight: getResponsiveSize(10) }}
                                name={otherUserInfo?.name}
                                mobileStatus={otherUserInfo?.mobile_status}
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={1} style={[CommonStyles.main_font_medium, { color: Theme.colors.primaryColorDark, fontSize: getResponsiveSize(18) }]}>{otherUserInfo?.name}</Text>
                            <View style={[CommonStyles.flex_row, { marginTop: -4 }]}>
                                <Text numberOfLines={1} style={[CommonStyles.main_font_regular, { marginTop: getResponsiveSize(4), fontSize: getResponsiveSize(12), color: Colors.grey, flex: 1 }]}>{getStatusTitle(otherUserInfo?.mobile_status)}</Text>
                            </View>
                        </View>
                        {
                            detailInfo?.unReadCount > 0 &&
                            <UnreadCount count={detailInfo?.unReadCount} />
                        }

                    </View>
                </View>
                <Divider />
            </View>
            <View style={{
                flex: 1,
                overflow: 'hidden'
            }}>
                <ModalShowDate date={dateVal} isShow={showModalDate} />
                <FlatList
                    data={detailInfo?.list}
                    ref={flatlistRef}
                    onViewableItemsChanged={onViewItems}
                    style={{
                        paddingVertical: getResponsiveSize(10),
                        paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING)
                    }}
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 0
                    }}
                    onScrollBeginDrag={() => {
                        if (dateVal !== '') {
                            setShowModalDate(true);
                        }
                    }}
                    onScrollEndDrag={() => setShowModalDate(false)}
                    onScroll={({ nativeEvent }) => {
                        if (!props.loading) {
                            if (isCloseToTop(nativeEvent, getResponsiveSize(60))) {
                                setShowToDown(false);
                            } else {
                                setShowToDown(true);
                            }

                            if (isCloseToBottom(nativeEvent) && CHAT_LOAD_INFO.loadMore === false
                                && detailInfo?.list?.length > 0 && detailInfo?.list?.length < detailInfo?.totalCount) {
                                onLoadListData(true);
                            }
                        }
                    }}
                    inverted={true}
                    renderItem={renderChatContentItem}
                    keyExtractor={(item, index) => index}
                />
            </View>

            <View style={[styles.bottomControlContainer, CommonStyles.flex_row, {
                paddingVertical: getResponsiveSize(14)
            }]}>
                {
                    showToDown &&
                    <TouchableOpacity onPress={() => onGotoDown()} style={[styles.toDown, CommonStyles.center]}>
                        <MaterialCommunityIcons name="chevron-double-down" size={getResponsiveSize(30)} />
                    </TouchableOpacity>
                }
                {
                    detailInfo?.isTyping &&
                    <Text style={[CommonStyles.main_font_regular, styles.typingFlagWrapper]}>{otherUserInfo?.name + " " + getString('is typing...')}</Text>
                }
                <View style={{ flex: 1, backgroundColor: '#F4F4F4', paddingVertical: getResponsiveSize(10) }}>

                    <TextInput
                        multiline={true}
                        placeholderTextColor={Theme.colors.gray}
                        placeholder={getString("Type here...")}
                        value={selectedMessage}
                        onFocus={() => onSendFocusInfo()}
                        onChangeText={(val) => onChangeText(val)}
                        style={[CommonStyles.main_font_regular, {
                            paddingHorizontal: getResponsiveSize(10),
                            // paddingVertical: getResponsiveSize(10),
                            paddingVertical: Platform.OS === 'android' ? 0 : 'auto',
                            width: '100%'
                        }]}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => onSendMessage()}
                    style={[{ paddingLeft: getResponsiveSize(10) }]}>
                    <MaterialCommunityIcons name="send-circle" size={getResponsiveSize(36)} color={Theme.colors.primaryColor} />
                </TouchableOpacity>
            </View>
        </LayoutMainView>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1
    },
    headerContainer: {
        elevation: 2,
    },
    bottomControlContainer: {
        backgroundColor: Colors.white,
        shadowColor: '#222222',
        shadowRadius: 2,
        shadowOffset: { width: -1, height: 1 },
        shadowOpacity: 0.3,
        elevation: 2,
        paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING)
    },
    titleContainer: {
        paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING),
    },
    typingFlagWrapper: {
        position: 'absolute',
        top: 0,
        left: getResponsiveSize(SCREEN_HOR_PADDING),
        fontSize: getResponsiveSize(10),
        color: Colors.grey
    },
    toDown: {
        width: getResponsiveSize(50),
        height: getResponsiveSize(50),
        position: 'absolute',
        opacity: 0.6,
        borderColor: Colors.coolGrey,
        borderWidth: getResponsiveSize(1),
        right: getResponsiveSize(SCREEN_HOR_PADDING),
        top: getResponsiveSize(-70),
        borderRadius: getResponsiveSize(32),
        backgroundColor: '#F4F4F4',
        shadowColor: '#222222',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
    },
    unreadWrapper: {
        backgroundColor: Colors.RED7,
        width: getResponsiveSize(24),
        height: getResponsiveSize(24),
        borderRadius: getResponsiveSize(16)
    }
});

export default ChatDetailScreen;

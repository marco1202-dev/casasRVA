import React, { Children, useEffect, useCallback, useState, useContext } from "react";
import { Alert } from "react-native";
import { CHAT_LOAD_INFO } from "../constants";
import { useLocalization } from "../localization";
import { ChatService } from "../services/ChatService";
import { socketManager } from "../services/SocketService";
import { getNumberVal } from "../utils/AppUtils";
import Global from "../utils/Global";
import { AuthenticationContext } from "./AuthenticationContext";

export const SocketConext = React.createContext({
    socket: null,
    chatInfo: null,
    setChatInfo: (_) => null,
    agentInfo: null,
    setAgentInfo: (_) => null,
    typingFlag: false,
    setTypingFlag: (_) => null,
    clear: () => null
});

export const SocketProvider = (props) => {
    const socket = socketManager;
    const { user, logout } = useContext(AuthenticationContext);
    const { getString } = useLocalization();

    const [chatInfo, setChatInfo] = useState(Global.chatInfo);

    const [agentInfo, setAgentInfo] = useState(null);

    const clearGlobalChatInfo = () => {
        Global.chatInfo = {
            totalUnreadCount: 0,
            chatList: [],
            detailInfo: {
                list: [],
                unReadCount: 0,
                totalCount: 0,
                isTyping: false,
                otherUserId: 0
            }
        };
        setChatInfo(Global.chatInfo);
    }
    const onSentMessage = useCallback((msg) => {

        let chat = msg.chat;
        let totalCount = msg.totalCount ?? 0;

        Global.chatInfo.detailInfo = {
            ...Global.chatInfo.detailInfo,
            totalCount,
            list: [chat, ...Global.chatInfo.detailInfo.list]
        };

        setChatInfo({
            ...Global.chatInfo
        })
    }, []);

    const onLoadClientChatHistory = () => {
        let sData = {
            user_id: user?.id,
            role: user?.role,
            other_id: Global.agentInfo?.id,
            pageNumber: CHAT_LOAD_INFO.pageNumber,
            pageCount: CHAT_LOAD_INFO.pageCount
        }

        ChatService.getChatHistory(sData)
            .then(async (res) => {
                let data = res?.data;
                if (data.firstId) {
                    CHAT_LOAD_INFO.firstId = data.firstId;
                }

                Global.chatInfo.totalUnreadCount = data?.unReadCount ?? 0;
                Global.chatInfo.detailInfo = {
                    ...data,
                    otherUserId: Global.agentInfo?.id,
                    unReadCount: data?.unReadCount ?? 0
                };

                setChatInfo({ ...Global.chatInfo });
            })
            .catch(err => {
                console.log(err);
            })
    }

    const clear = () => {
        clearGlobalChatInfo();
        Global.agentInfo = null;
        setAgentInfo(Global.agentInfo);

        setChatInfo({ ...Global.chatInfo });
    }

    const onTypingStarted = useCallback((data) => {
        let otherUserId = data.client_id;
        if (Global.user?.role === 'client') {
            otherUserId = data.agent_id;
        }

        Global.chatInfo.chatList.forEach(item => {
            if (item.id === otherUserId) {
                item.typingFlag = true;
            }
        });

        if (otherUserId === Global.chatInfo.detailInfo?.otherUserId) {
            Global.chatInfo.detailInfo.isTyping = true;
        }

        setChatInfo({ ...Global.chatInfo });
    }, []);

    const onTypingEnded = useCallback((data) => {
        let otherUserId = data.client_id;
        if (Global.user?.role === 'client') {
            otherUserId = data.agent_id;
        }

        Global.chatInfo.chatList.forEach(item => {
            if (item.id === otherUserId) {
                item.typingFlag = false;
            }
        });

        if (otherUserId === Global.chatInfo.detailInfo?.otherUserId) {
            Global.chatInfo.detailInfo.isTyping = false;
        }

        setChatInfo({ ...Global.chatInfo });
    }, []);

    const onLogoutPhone = useCallback((data) => {
        let fcm_key = data?.fcm_key ?? '';
        if (fcm_key !== '' && fcm_key === Global.fcm_key) {
            logout(false);
            Alert.alert(getString("Auto logged out because logged on another phone."));
        }
    }, []);

    const onReceiveMessage = useCallback((msg) => {

        let chat = msg.chat;
        let totalCount = msg.totalCount ?? 0;
        let unReadCount = msg.unReadCount ?? 0;

        let otherUserId = getNumberVal(chat.client_id);

        if (Global.user?.role === 'client') {
            otherUserId = getNumberVal(chat.agent_id);
        }

        if (otherUserId === Global.chatInfo.detailInfo.otherUserId) {
            Global.chatInfo.detailInfo = {
                ...Global.chatInfo.detailInfo,
                list: [chat, ...Global.chatInfo.detailInfo.list],
                totalCount,
                unReadCount
            };
        }

        if (Global.user?.role === 'agent') {

            Global.chatInfo.chatList.forEach(item => {
                if (item.id === otherUserId) {
                    item.lastChatInfo = chat;
                    item.unReadCount = unReadCount;
                }
            });
        }

        Global.chatInfo.totalUnreadCount = msg?.totalUnreadCount ?? 0;

        setChatInfo({
            ...Global.chatInfo
        })
    }, []);

    const onChatFocused = useCallback((msg) => {
        let data = msg.data;
        let unReadCount = msg.unReadCount;
        let totalUnreadCount = msg?.totalUnreadCount ?? 0;

        if (data.role === Global.user?.role) { // sender
            Global.chatInfo.detailInfo.unReadCount = unReadCount;
            Global.chatInfo.totalUnreadCount = totalUnreadCount;

            let otherUserId = data.client_id;

            if (Global.user?.role === 'client') {
                otherUserId = data.agent_id;
            }

            if (Global.user?.role === 'agent') {
                Global.chatInfo.chatList.forEach(item => {
                    if (item.id === otherUserId) {
                        item.unReadCount = unReadCount;
                    }
                });
            }

            setChatInfo({ ...Global.chatInfo });
        } else {
            let last_id = data?.last_id;

            Global.chatInfo.detailInfo.list?.forEach(item => {
                if (item.id <= last_id) {
                    item.read_status = 2;
                } else {
                    item.read_status = 1;
                }
            })

            setChatInfo({
                ...Global.chatInfo
            })
        }
    }, []);

    const onEventAssignStatus = useCallback((msg) => {
        onLoadChatList();
    }, []);

    const onLoadChatList = () => {
        ChatService.getChatUserList()
            .then(res => {
                let data = res.data;

                if (data?.error === 'LOGOUT') {
                    logout();
                } else {
                    let list = data?.list ?? [];
                    let totalUnreadCount = data?.totalUnreadCount ?? 0;

                    if (user?.role === 'client') {
                        if (list?.length > 0) {
                            Global.agentInfo = list[0];
                            setAgentInfo({ ...Global.agentInfo });

                            onLoadClientChatHistory();
                        } else {
                            Global.agentInfo = null;
                            setAgentInfo(Global.agentInfo);
                        }
                    } else {
                        Global.chatInfo.chatList = list;
                    }
                    Global.chatInfo.totalUnreadCount = totalUnreadCount;

                    setChatInfo({ ...Global.chatInfo });
                }
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    useEffect(() => {
        if (user) {
            onLoadChatList();
        } else {
            clearGlobalChatInfo();
            setChatInfo({ ...Global.chatInfo });
        }
    }, [user])

    useEffect(() => {
        socket?.on('sent_message', onSentMessage);
        socket?.on('receive_message', onReceiveMessage);
        socket?.on('chat_focused', onChatFocused);
        socket?.on('typing_started', onTypingStarted);
        socket?.on('typing_ended', onTypingEnded);
        socket?.on('logout_prev_phone', onLogoutPhone);
        socket?.on('assigned_status_info', onEventAssignStatus);

        return () => {
            socket?.off('sent_message', onSentMessage);
            socket?.off('receive_message', onReceiveMessage);
            socket?.off('chat_focused', onChatFocused);
            socket?.off('typing_started', onTypingStarted);
            socket?.off('typing_ended', onTypingEnded);
            socket?.off('logout_prev_phone', onLogoutPhone);
            socket?.off('assigned_status_info', onEventAssignStatus);
        }
    }, []);

    return (
        <SocketConext.Provider
            value={{
                socket, chatInfo, setChatInfo,
                agentInfo, setAgentInfo,
                clear
            }}
        >
            {Children.only(props.children)}
        </SocketConext.Provider>
    );
}

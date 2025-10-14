import SocketIO from 'socket.io-client';
import { SOCKET_URL } from '../constants';
import Global from '../utils/Global';

export var socketManager = null;
socketManager = SocketIO(SOCKET_URL);

socketManager?.on('connect', (data) => {
    if (Global.user) {
        let item = {
            id: Global.user?.id,
            role: Global.user?.role
        };
        SocketService.joinStatusCheck(item);
    }
});

const socketLogin = (user) => {
    let prev_fcm_key = user?.prev_fcm_key ?? '';

    let fcm_key = '';
    if (prev_fcm_key !== '' && prev_fcm_key !== Global.fcm_key) {
        fcm_key = prev_fcm_key;
    }

    let request = {
        id: user?.id,
        role: user?.role,
        fcm_key
    };
    socketManager.emit('login', request);
}

const socketLogout = (user, change_status = true) => {
    let fcm_key = Global.fcm_key ?? '';
    let request = {
        id: user?.id,
        role: user?.role,
        fcm_key,
        change_status
    };
    socketManager.emit('logout', request);
}

const sendMessage = async (item) => {
    await socketManager.emit('send_message', item);
}

const sendTypingStatus = async (item, isEnd = true) => {
    if (isEnd === true) {
        await socketManager.emit('typing_end', item);
    } else {
        await socketManager.emit('typing_start', item);
    }
}

const sendNotificationToAgent = (item) => {
    socketManager.emit('send_notification_to_agent', item);
}

const sendMobileStatus = (item) => {
    socketManager.emit('change_mobile_status', item);
}

const joinStatusCheck = (item) => {
    socketManager.emit('join_status_check', item);
}

const sendFocusStatus = async (item) => {
    await socketManager?.emit('chat_focused', item);
}

const connect = () => {
    socketManager?.connect();
}

export const SocketService = {
    socketLogin,
    socketLogout,
    connect,
    sendMessage,
    sendTypingStatus,
    sendFocusStatus,
    sendNotificationToAgent,
    sendMobileStatus,
    joinStatusCheck
};


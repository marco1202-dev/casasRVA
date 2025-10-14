import messaging from '@react-native-firebase/messaging'
import { Platform } from 'react-native'

class FCMService {
    register = (onRegister, onNotification, onOpenNotification) => {
        this.checkPermission(onRegister);
        this.createNotificationListeners(onRegister, onNotification, onOpenNotification);
    };

    registerAppWithFCM = async () => {
        if (Platform.OS === 'ios') {
            // await messaging().registerDeviceForRemoteMessages();
            await messaging().setAutoInitEnabled(true);
        }
    };
    checkPermission = (onRegister) => {
        messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    // User has permissions
                    this.getToken(onRegister);
                }
                else {
                    this.requestPermission(onRegister);
                }
            }).catch(error => {
                console.log("[FCMService] Permission rejected", error);
            })
    };
    getToken = (onRegister) => {
        messaging().getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    onRegister(fcmToken);
                }
                else {
                    console.log("[FCMService] User does not have a device token");
                }
            }).catch(error => {
                console.log("[FCMService] getToken rejected", error);
            })
    };
    requestPermission = (onRegister) => {
        messaging().requestPermission()
            .then(() => {
                this.getToken(onRegister);
            }).catch(error => {
                console.log("[FCMService] Request Permission rejected", error);
            })
    };

    deleteToken = () => {
        messaging().deleteToken()
            .catch(error => {
                console.log("[FCMService] Delete token error", error);
            })
    };

    createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {
        // When the application is running, but in the background
        messaging()
            .onNotificationOpenedApp(remoteMessage => {
                if (remoteMessage) {
                    //.notification
                    onOpenNotification(remoteMessage)
                }
            });
        // When the application is opened from a quit state
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    //.notification
                    onOpenNotification(remoteMessage)
                }
            });
        // Foreground state messages
        this.messageListener = messaging().onMessage(async remoteMessage => {
            if (remoteMessage) {
                let notification = null;
                let data = null;
                if (Platform.OS === 'ios') {
                    notification = remoteMessage.notification;
                    data = remoteMessage?.data;
                }
                else {
                    notification = remoteMessage.notification        // .notification;
                    data = remoteMessage?.data;
                }
                onNotification(notification, data);
            }
        });

        // Triggered when have new token
        messaging().onTokenRefresh(fcmToken => {
            onRegister(fcmToken);
        })
    };

    unRegister = () => {
        this.messageListener()
    }
}

export const fcmService = new FCMService();

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import React, { Children, useContext, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { AuthService } from "../services";
import { fcmService } from "../services/FCMService";
import { PushNotificationService } from "../services/PushNotificationService";
import { SocketService } from "../services/SocketService";
import Global from "../utils/Global";
import { SocketConext } from "./SocketContext";

export const AuthenticationContext = React.createContext({
  user: null,
  login: async (_) => null,
  logout: async (_) => null,
});

export const AuthenticationProvider = (props) => {
  const [user, setUser] = useState(null);
  const { clear } = useContext(SocketConext);

  const appState = useRef(AppState.currentState);

  const login = async (user) => {
    axios.defaults.headers["Authorization"] =
      "Bearer " + (await AsyncStorage.getItem("AccessToken"));
    await AsyncStorage.setItem(
      "User", JSON.stringify(user)
    );
    Global.user = user;
    setUser(Global.user);
    return Promise.resolve(true);
  };

  const logout = async (change_status = true) => {
    await AsyncStorage.multiRemove(["AccessToken", "User"]);
    axios.defaults.headers["Authorization"] = null;

    let data = {
      id: Global.user?.id,
      role: Global.user?.role
    }

    SocketService.socketLogout(data, change_status);

    Global.user = null;
    setUser(null);

    clear();
    return Promise.resolve(true);
  };

  const checkLoginAndSet = (userInfo) => {

    let user_id = userInfo?.id;
    let fcm_key = Global.fcm_key;

    AuthService.checkLoginStatus(user_id, fcm_key)
      .then(res => {
        let data = res.data;
        if (data?.error === 'LOGOUT' || data?.status === false) {
          logout();
          return;
        }

        Global.user = userInfo;
        SocketService.socketLogin(Global.user);
        setUser({ ...Global.user });
      })
      .catch(err => {
        console.log(err.message);
      })
  }

  function onRegister(token) {
    Global.fcm_key = token;

    AsyncStorage.multiGet(["AccessToken", "User"]).then((response) => {
      const _accessToken = response[0][1];
      const _user = response[1][1];
      if (_accessToken && _user) {
        axios.defaults.headers["Authorization"] = "Bearer " + _accessToken;

        let userInfo = JSON.parse(_user);
        checkLoginAndSet(userInfo);
      }
    });
  }

  function onNotification(notify, data) {

    // if (data && user) {
    //   if (getNumberVal(data?.client_id) !== user?.id && getNumberVal(data?.agent_id) !== user?.id) {
    //     return;
    //   }
    // }

    // if (Global.notificationSetting === 'no' || appState.current === 'active') {
    //   return;
    // }

    const options = {
      soundName: 'default',
      playSound: true
    };
    PushNotificationService.showNotification(
      0,
      notify.title,
      notify.body,
      notify,
      options
    )
  }

  function onOpenNotification(notify) {
  }

  useEffect(() => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    PushNotificationService.configure(onOpenNotification);
    const subscription = AppState.addEventListener("change", nextAppState => {

      appState.current = nextAppState;

      if (Global.user) {
        let request = {
          id: Global.user?.id,
          role: Global.user?.role
        };
        if (appState.current === 'active') {
          request.status = 1;
          SocketService.sendMobileStatus(request)

        } else if (appState.current === 'background') {
          request.status = 2;
          SocketService.sendMobileStatus(request)
        }
      }
    });

    return () => {
      // fcmService.unRegister();
      PushNotificationService.unregister();
      subscription?.remove();
    }
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{ login, logout, user }}
    >
      {Children.only(props.children)}
    </AuthenticationContext.Provider>
  );
};

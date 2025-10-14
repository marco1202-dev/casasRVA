import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { API_URL, getLang } from "./src/constants";
import { initLocalization } from "./src/localization";
import { LoadingManager } from "./src/presentation";
import { Linking, LogBox } from "react-native";
import { configureGlobalTypography, getNotificationSetting, getNumberVal } from "./src/utils/AppUtils";
import RootNavigator from "./src/navigations/RootNavigator";
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Global from "./src/utils/Global";

LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreAllLogs();

axios.defaults.baseURL = API_URL;
axios.defaults.headers['Accept'] = 'application/json';
axios.defaults.headers['Content-Type'] = 'application/json';

axios.interceptors.request.use(
  (config) => {
    LoadingManager.showLoading();
    return config;
  },
  (err) => {
    LoadingManager.hideLoading();
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  (config) => {
    LoadingManager.hideLoading();
    return config;
  },
  (err) => {
    console.log('err', err.message);
    LoadingManager.hideLoading();
    return Promise.reject(err);
  }
);

const App = () => {

  const [isRendered, setIsRendered] = useState(false);

  const onDynamicLink = async (link) => {
    processDynamicLink(link);
  }

  const processDynamicLink = (link) => {
    let url = link?.url ?? '';
    if (url.includes('http://casasrvapp.dyanmic.com')) {
      let tempArr = url.split('=');
      if (tempArr.length > 1) {
        Global.dynamic_agent_id = tempArr[1];
      } else {
        Global.dynamic_agent_id = 0;
      }
    } else {
      Global.dynamic_agent_id = 0;
    }
  }

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(onDynamicLink);

    dynamicLinks()
      .getInitialLink()
      .then(link => {
        processDynamicLink(link);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchSettingInfo = async () => {
      Global.notificationSetting = await getNotificationSetting();
    }

    AsyncStorage.getItem("APP_LANGUAGE").then((appLang) => {
      if (appLang === undefined || appLang === null) {
        appLang = "en";
      }
      const availableLang = getLang(appLang);
      initLocalization(availableLang);

      setIsRendered(true);

      fetchSettingInfo();
    });
  }, []);

  configureGlobalTypography();

  if (!isRendered) {
    return null;
  }
  return <RootNavigator />;
};

export default App;

import moment from 'moment';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Dimensions, I18nManager, Text } from 'react-native';
import { getLang, IMAGES_URL, SEARCH_MAX_PRICE, SEARCH_MAX_SIZE, SEARCH_MIN_PRICE, SEARCH_MIN_SIZE } from '../constants';
import Geocoding from './Geocoding';
import Global from './Global';

import Toast from 'react-native-toast-message';
import Colors from '../styles/Colors';
const defaultDeviceWidth = 430;
Geocoding.setInit(getLang());

export const getScreenWidth = () => {
    return Dimensions.get("screen").width;
};

export const getScreenHeight = () => {
    return Dimensions.get("screen").height;
};

export const getNumberVal = (value, defaultVal = 0) => {
    if (value == null || value === undefined) {
        return defaultVal;
    }

    return parseInt(value) ?? 0;
};

export const showToast = (type, text1, text2) => {
    Toast.show({
        type,
        text1,
        text2
    })
}

export const getStrVal = (value, defaultVal = "") => {
    if (value == null || value === undefined) {
        return defaultVal;
    }

    if (typeof (value) === 'string') {
        if (value === "null") {
            return '';
        }

        return value;
    }

    if (typeof (value) === 'number') {
        return `${value}`;
    }

    return value;
};

export const captitalize = (strVal) => {
    return strVal.charAt(0).toUpperCase() + strVal.slice(1);
};

export const copyObjListAfterRemoveDuplicated = (list) => {
    let ids = [];
    let resList = [];
    list.forEach(item => {
        if (!ids.includes(item.id)) {
            ids.push(item.id);
            resList.push({ ...item });
        }
    });

    return resList;
};

export const copyObjList = (list) => {
    return list.map(item => {
        return { ...item };
    });
};

export const getTimerFormatBySeconds = (seconds_val) => {

    if (seconds_val <= 0) {
        return "00:00:00";
    }

    const days = Math.floor(seconds_val / 86400);
    let restVal = seconds_val % 86400;

    const hours = Math.floor(restVal / 3600);

    restVal = restVal % 3600;
    const minutes = Math.floor(restVal / 60);
    const seconds = restVal % 60;

    if (days > 1) {
        return `${days} days ${padStart(hours)}:${padStart(minutes)}:${padStart(seconds)}`
    } else if (days > 0 && days <= 1) {
        return `${days} day ${padStart(hours)}:${padStart(minutes)}:${padStart(seconds)}`
    }

    return `${padStart(hours)}:${padStart(minutes)}:${padStart(seconds)}`
};

const padStart = (val) => {
    const pad = (val < 10) ? '0' : '';
    return `${pad}${val}`
};

export const getResponsiveSize = (val, direct = 1) => {

    let screenWidth = getScreenWidth();
    let res;

    let diff = Math.abs(defaultDeviceWidth - screenWidth);

    let sign = 1;
    if (screenWidth < defaultDeviceWidth) {
        sign = -1;
    }

    let fee = 0;

    if (diff > 300) {
        fee = 0.33;
    } else if (diff > 200 && diff <= 300) {
        fee = 0.25;
    } else if (diff > 100 && diff <= 200) {
        fee = 0.14;
    } else if (diff > 50 && diff <= 100) {
        fee = 0.06;
    }

    res = val * (1 + sign * direct * fee);

    return res;
};

export const checkValidateDate = (timeInfo) => {
    if (timeInfo === undefined || timeInfo == null) {
        return false;
    }

    if (typeof timeInfo !== 'string') {
        return true;
    }

    return !timeInfo.includes('0000-');
};

export const checkValidateStrDate = (timeInfo) => {

    if (!timeInfo) {
        return false;
    }

    if (typeof timeInfo !== 'string') {
        return false;
    }

    return !timeInfo.includes('0000');
}

export const getRandomVal = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

export const getDateObjFromStr = (strTime) => {
    if (checkValidateStrDate(strTime)) {
        return new Date(moment(strTime));
    }

    return new Date();
}

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const getDateTimeFormat = (timeInfo, type) => {
    if (!checkValidateDate(timeInfo)) {
        return '';
    }

    return moment(timeInfo).format(type);
};

export const checkSameStrings = (insVal, checkVal) => {
    if (!insVal) {
        return false;
    }
    return insVal.toLowerCase() === checkVal.toLowerCase();
};

export const getTimerFormat = (start_time, end_time = "") => {

    if (!start_time) {
        return "00:00:00";
    }

    let start = moment(start_time);

    let current = end_time === "" ? moment() : moment(end_time);

    let duration = Math.floor(moment.duration(current.diff(start)).asSeconds());

    let hours = Math.floor(duration / 3600);
    if (hours < 10) {
        hours = "0" + hours;
    }

    let left = duration % 3600;

    let minutes = Math.floor(left / 60);
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    let seconds = left % 60;
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    return `${hours}:${minutes}:${seconds}`;
};

export const getCurrentTime = () => {
    return moment().format('yyyy-MM-DD HH:mm:ss')
};

export const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }, paddingToBottom = 20) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

export const isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }, paddingToTop = 20) => {
    return contentOffset.y <= paddingToTop;
};

export const getUrlExtention = (url) => {
    return url?.split(/[#?]/)[0].split(".").pop().trim();
}

export const getImageUrl = (imageName) => {
    return IMAGES_URL + imageName;
};

export const saveSearchInfo = async (searchInfo) => {
    await AsyncStorage.setItem("SEARCH_INFO", JSON.stringify(searchInfo));
}

export const getDefaultSearchInfo = () => {
    return {
        searchKey: "",
        price: {
            type: 'all',
            minPrice: SEARCH_MIN_PRICE,
            maxPrice: SEARCH_MAX_PRICE,
        },
        bedrooms: {
            type: 'all',
            values: []
        },
        bathrooms: {
            type: 'all',
            values: []
        },
        garages: {
            type: 'all',
            values: []
        },
        livingArea: {
            type: 'all',
            minSize: SEARCH_MIN_SIZE,
            maxSize: SEARCH_MAX_SIZE
        },
        land: 'yes',
        forSale: 'yes',
        pending: 'yes',
        sold: 'yes'
    };
}

export const loadSearchInfo = async () => {
    let result = getDefaultSearchInfo();
    let strInfo = await AsyncStorage.getItem('SEARCH_INFO');
    if (strInfo) {
        try {
            let tempResult = JSON.parse(strInfo);
            result = tempResult;
        } catch (err) {

        }
    }

    return result;
}

export const configureGlobalTypography = () => {
    const oldTextRender = (Text).render;
    (Text).render = function (...args) {
        const origin = oldTextRender.call(this, ...args);
        return React.cloneElement(origin, {
            allowFontScaling: false,
            style: [
                {
                    fontFamily: "rubik-regular",
                    writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
                },
                origin.props.style,
            ],
        });
    };
};



export const getCloneObject = (obj) => {
    let newObj = Object.keys(obj).map(item => ({
        ...item
    }))

    return newObj;
}

export const setNotificationSetting = async (val) => {
    await AsyncStorage.setItem("Notificaton_Setting", val);
}

export const getStatusInfo = (item) => {
    let result = {
        name: "For sale",
        color: Colors.forSaleColor
    }

    let status = item.status?.toLowerCase();
    if (status === "active" || status === "for sale") {
        result.name = "For Sale";
        result.color = Colors.forSaleColor;
    } else if (status === 'pending') {
        result.name = "Pending";
        result.color = Colors.pendingColor;
    } else if (status === "closed") {
        result.name = "Sold";
        result.color = Colors.soldColor;
    }

    return result;
}

export const getNotificationSetting = async () => {
    if (Global.notificationSetting !== '') {
        return Global.notificationSetting;
    }

    let val = await AsyncStorage.getItem('Notificaton_Setting');

    if (val) {
        Global.notificationSetting = val;
    }

    return val ?? 'yes';
}

export const getMapConfig = (listData) => {
    let result = {
        latitude: 37.3973665,
        longitude: -77.463241,
        latitudeDelta: 0.6474764999999998,
        longitudeDelta: 1.042660050000002
    };

    if (listData.length < 1) {
        return result;
    }

    let maxLatitude = parseFloat(listData[0]?.latitude)  ?? -180;
    let minLatitude = listData[0]?.latitude ?? 180;

    let maxLongitude = listData[0]?.longitude ?? -90;
    let minLongitude = listData[0]?.longitude ?? 90;

    listData.forEach(item => {
        if (item.latitude > maxLatitude) {
            maxLatitude = item.latitude;
        }

        if (item.latitude < minLatitude) {
            minLatitude = item.latitude;
        }

        if (item.longitude > maxLongitude) {
            maxLongitude = item.longitude;
        }

        if (item.longitude < minLongitude) {
            minLongitude = item.longitude;
        }
    });

    result.latitude = (maxLatitude + minLatitude) / 2.0;
    result.longitude = (maxLongitude + minLongitude) / 2.0;

    result.latitudeDelta = Math.abs((maxLatitude - minLatitude)) + 0.2;
    result.longitudeDelta = Math.abs((maxLongitude - minLongitude)) + 0.2;

    // if (result.latitudeDelta > result.longitudeDelta) {
    //     result.latitudeDelta = result.longitudeDelta;
    // } else {
    //     result.longitudeDelta = result.latitudeDelta;
    // }

    return result;
}



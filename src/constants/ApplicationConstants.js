export const BASE_URL = "https://casas.buynsellrva.com/";
export const SOCKET_URL = "http://209.97.149.142:8002/";

// export const BASE_URL = "http://192.168.0.114:8901/";
// export const SOCKET_URL = "http://192.168.0.114:8002/";

export const API_URL = BASE_URL + "api";
export const IMAGES_URL = BASE_URL;

export const SEARCH_MIN_PRICE = 0;
export const SEARCH_MAX_PRICE = 1000000;
export const SEARCH_MIN_SIZE = 0;
export const SEARCH_MAX_SIZE = 10000;

export const WEB_CLIENT_ID_GOOGLE_SIGNIN = '179958264658-bhmqvhqqskc373fj0ts04sb65cd7p2f9.apps.googleusercontent.com';

export const IOS_CLIENT_ID = '179958264658-crdl5calbda3de7vrif4nnhce1hvq2pt.apps.googleusercontent.com';
export const ANDROID_CLIENT_ID = '179958264658-tr6toobalur495qopphim07kk0309uk0.apps.googleusercontent.com';

export const LINKEDIN_CLIENT_ID = "78r11qr7gfclrc";
export const LINKEDIN_CLIENT_SECRET = "52Jxf6WwddEqolog";

export const GOOGLE_API_KEY = 'AIzaSyAoBVp4Zw_LLO4NRgXVZltuJ9_CkXy279o';
export const PRIVACY_POLICY_URL = "https://buynsellrva.com/privacy-policy/";

export const ADDITIONAL_FEATURES_SEPARATOR_CHARACTER = ",";

export const SCREEN_HOR_PADDING = 16;

export let PAGE_LOAD_INFO = {
  loadMore: false,
  pageNumber: 0,
  pageCount: 10
};

export let NOTIFICATION_LOAD_INFO = {
  loadMore: false,
  pageNumber: 0,
  pageCount: 30
};

export let CHAT_LOAD_INFO = {
  loadMore: false,
  firstId: 0,
  pageNumber: 0,
  pageCount: 30
};

export let loginInfo = {
  email: '',
  password: ''
};

export const LANGUAGES = [
  {
    lang: "en",
    isRTL: false,
  },
  {
    lang: "es",
    isRTL: false,
  }
];

export const getLang = (lang) => {
  const foundLang = LANGUAGES.find((a) => a.lang === lang);
  if (foundLang) {
    return foundLang;
  }
  return {
    lang: "en",
    isRTL: false,
  };
};

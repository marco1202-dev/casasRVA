import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Global from "../utils/Global";

const getErrorString = (errors) => {
  let errMessage = "";
  let keys = Object.keys(errors);
  keys?.forEach((val, index) => {
    errMessage += errors[val];
    if (index < keys.length - 1) {
      errMessage += "\n";
    }
  });

  return errMessage;
}

const login = async (email, password) => {

  let fcm_key = Global.fcm_key ?? '';
  try {
    const result = await axios.post("mobile/user/login", {
      email,
      password,
      fcm_key
    });

    if (result?.data?.error) {
      return Promise.reject(Error(result?.data?.error));
    }

    await AsyncStorage.multiSet([
      ["User", JSON.stringify(result.data.user)],
      ["AccessToken", result.data.access_token],
    ]);

    return Promise.resolve(result.data.user);
  } catch (error) {
    console.log('error = ', error);
    return Promise.reject(error);
  }
};

const register = async (
  name,
  email,
  password,
  agent_id = 0
) => {
  let result = null;
  try {
    
    result = await axios.post("mobile/user/signup", {
      name,
      email,
      password,
      role: 'client',
      agent_id
    });

    
    if (result?.data?.errors) {
      return Promise.reject(Error(getErrorString(result?.data?.errors)));
    }

    const user = await login(email, password);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

const forgotPassword = async (email) => {

  try {
    const result = await axios.post("mobile/user/forgot-password", {
      email
    });

    if (result?.data?.errors) {
      return Promise.reject(Error(getErrorString(result?.data?.errors)));
    }

    return Promise.resolve("success");
  } catch (error) {
    console.log('error = ', error);
    return Promise.reject(error);
  }
};

const confirVerify = async (email, verificationCode) => {
  return await axios.post("mobile/user/confirm-verificationcode", {
    email,
    verificationCode
  });
};

const socialLogin = async (email, name, type, id_token, agent_id = 0) => {
  try {
    let fcm_key = Global.fcm_key ?? '';
    const result = await axios.post("mobile/user/social-login", {
      email,
      name,
      fcm_key,
      type,
      id_token,
      agent_id
    });

    if (result?.data?.error) {
      return Promise.reject(Error(result?.data?.error));
    }

    await AsyncStorage.multiSet([
      ["User", JSON.stringify(result.data.user)],
      ["AccessToken", result.data.access_token],
    ]);

    return Promise.resolve(result.data.user);
  } catch (error) {
    console.log('error = ', error);
    return Promise.reject(error);
  }
}

const getEmailByToken = async (id_token) => {
  return await axios.post("mobile/user/get-email-by-token", {
    id_token
  })
}

const checkLoginStatus = async (user_id, fcm_key) => {
  return await axios.post("mobile/user/check-login-status", {
    user_id,
    fcm_key
  })
}

const changePassword = async (email, password) => {

  try {
    const result = await axios.post("mobile/user/change-password", {
      email,
      password
    });

    if (result?.data?.errors) {
      return Promise.reject(Error(getErrorString(result?.data?.errors)));
    }

    return Promise.resolve("success");
  } catch (error) {
    console.log('error = ', error);
    return Promise.reject(error);
  }
};

export const AuthService = {
  login,
  socialLogin,
  checkLoginStatus,
  register,
  getEmailByToken,
  confirVerify,
  forgotPassword,
  changePassword
};

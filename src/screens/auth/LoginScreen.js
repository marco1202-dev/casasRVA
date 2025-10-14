import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState, useEffect } from "react";
import {
  Alert, ScrollView, StyleSheet, TouchableOpacity,
  Platform
} from "react-native";
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager, } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';

import {
  PrimaryButton,
  Separator,
  Text,
  TextInput
} from "../../components";
import CommonStyles from "../../styles/CommonStyles";
import HeaderLine from "./components/HeaderLine";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { useLocalization } from "../../localization";
import NavigationNames from "../../navigations/NavigationNames";
import { AuthService } from "../../services";
import { Theme } from "../../theme";
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID, loginInfo, WEB_CLIENT_ID_GOOGLE_SIGNIN } from "../../constants";
import { SocketService } from "../../services/SocketService";
import { getResponsiveSize, getScreenWidth } from "../../utils/AppUtils";
import Global from "../../utils/Global";
import LayoutMainView from "../../components/layouts/LayoutMainView";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from "../../styles/Colors";

const LoginScreen = () => {
  const authContext = useContext(AuthenticationContext);
  const navigation = useNavigation();
  const { getString } = useLocalization();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID_GOOGLE_SIGNIN,
      offlineAccess: false,
      iosClientId: IOS_CLIENT_ID,
      androidClientId: ANDROID_CLIENT_ID
    });
  }, []);

  const getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'email,id,name,first_name,last_name',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      { token, parameters: PROFILE_REQUEST_PARAMS },
      (error, user) => {
        if (error) {
          console.log(error);
        } else {
          let request = {
            email: user.email,
            name: user.name ?? user.email,
            type: 'facebook'
          }
          socialLogin(request);
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  const socialLogin = async (socialUser) => {
    let email = socialUser?.email;
    let name = socialUser?.name;
    let type = socialUser?.type;

    let id_token = socialUser?.id_token ?? '';

    AuthService.socialLogin(email, name, type, id_token, Global.dynamic_agent_id)
      .then(async (user) => {
        await authContext.login(user);
        SocketService.socketLogin(user);
        loginInfo.email = email;
        // loginInfo.password = password;

        navigation.goBack();
      })
      .catch((e) => Alert.alert(e.message));
  }

  const onPressOauthLogin = async (type) => {
    if (type === 'facebook') {
      LoginManager.logInWithPermissions(['public_profile', 'email']).then(
        login => {
          if (login.isCancelled) {
          } else {
            AccessToken.getCurrentAccessToken().then(data => {
              const accessToken = data.accessToken.toString();
              getInfoFromToken(accessToken);
            });
          }
        },
        error => {
          console.log(error);
        },
      );
    } else if (type === 'google') {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        let request = {
          email: userInfo.user?.email,
          name: userInfo.user?.name,
          type: 'google'
        }

        socialLogin(request);
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // sign in was cancelled
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        } else {
          console.log(`Something went wrong. ${error}`);
        }
      }
    } else if (type === 'apple') {
      // start a login request
      try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL],
        });

        const {
          user,
          email,
          nonce,
          identityToken,
          realUserStatus /* etc */,
        } = appleAuthRequestResponse;

        if (identityToken) {
          // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
        } else {
          // no token - failed sign-in?
        }

        // check with 

        if (!email) {
          let response = await AuthService.getEmailByToken(user);
          let savedEmail = response.data?.email ?? '';

          if (!savedEmail) {
            alert('Please disable the option "hide your email" in apple sign in');
            return;
          }

          await socialLogin({
            email: savedEmail,
            name: savedEmail,
            type: 'apple'
          });

        } else {
          await socialLogin({
            email,
            name: email,
            id_token: user,
            type: 'apple'
          });
        }
        // console.warn(`Apple Authentication Completed, ${user}, ${email}`);
      } catch (error) {
        if (error.code === appleAuth.Error.CANCELED) {
          console.warn('User canceled Apple Sign in.');
        } else {
          console.error(error);
        }
      }
    }
  }

  const onPressLogin = () => {
    if (email === "" || password === "") {
      Alert.alert(getString("Required Login Inputs"));
      return;
    }
    AuthService.login(email, password)
      .then(async (user) => {
        SocketService.socketLogin(user);

        delete user['prev_fcm_key'];
        await authContext.login(user);
        loginInfo.email = email;
        loginInfo.password = password;

        navigation.goBack();
      })
      .catch((e) => Alert.alert(e.message));
  };

  const onPressRegister = () => {
    navigation.navigate(NavigationNames.RegisterScreen);
  };

  return (
    <LayoutMainView isAvoid={true}>
      <HeaderLine navigation={navigation} />
      <ScrollView contentContainerStyle={[styles.contentContainerStyle]}>
        <Text style={styles.titleText}>{getString("Login Title")}</Text>
        <TextInput
          placeholderTextColor={Theme.colors.gray}
          placeholder={getString("User Email")}
          value={email}
          onChangeText={setEmail}
        />
        <Separator height={16} />
        <TextInput
          placeholderTextColor={Theme.colors.gray}
          placeholder={getString("Password")}
          secureTextEntry={true}
          textContentType="none"
          autoCorrect={false}
          value={password}
          onChangeText={setPassword}
        />
        <Separator height={32} />
        <PrimaryButton
          title={getString("Login")}
          onPress={onPressLogin}
        />
        <Separator height={20} />
        <TouchableOpacity style={[styles.oauthButton,
        CommonStyles.flex_row, {
          backgroundColor: '#4267B2',
          paddingHorizontal: getResponsiveSize(12),
          alignItems: "center", justifyContent: 'center'
        }]} onPress={() => onPressOauthLogin('facebook')}>
          <Text style={styles.oauthButtonText}>{getString('Login with')}</Text>
          <FontAwesome style={{ marginHorizontal: getResponsiveSize(6) }} name="facebook" color={Colors.white}
            size={getResponsiveSize(24)} />
          <Text style={styles.oauthButtonText}>Facebook</Text>
        </TouchableOpacity>
        <Separator height={20} />
        <TouchableOpacity style={[styles.oauthButton, CommonStyles.flex_row, {
          paddingHorizontal: getResponsiveSize(12),
          alignItems: "center", justifyContent: 'center'
        }]} onPress={() => onPressOauthLogin('google')}>
          <Text style={styles.oauthButtonText}>{getString('Login with')}</Text>
          <FontAwesome style={{ marginHorizontal: getResponsiveSize(6) }} name="google" color={Colors.white}
            size={getResponsiveSize(24)} />
          <Text style={styles.oauthButtonText}>Google</Text>
        </TouchableOpacity>
        {
          Platform.OS === 'ios' && appleAuth.isSupported &&
          <>
            <Separator height={20} />
            <AppleButton
              buttonStyle={AppleButton.Style.BLACK}
              buttonType={AppleButton.Type.SIGN_UP}
              style={{
                width: getScreenWidth() - 32,
                height: getResponsiveSize(54)
              }}
              onPress={() => onPressOauthLogin('apple')}
            />

          </>
        }

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => onPressRegister()}
        >
          <Text style={styles.registerButtonTitle}>
            {getString("Register")}
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => navigation.navigate(NavigationNames.EmailConfirmScreen)}
        >
          <Text style={styles.registerButtonTitle}>
            {getString("Forgot Password")}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </LayoutMainView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  titleText: {
    fontSize: 42,
    fontFamily: "rubik-light",
    color: Theme.colors.primaryColor,
    marginBottom: 24,
  },
  registerButton: {
    alignSelf: "center",
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  registerButtonTitle: { color: Theme.colors.black },
  forgotButton: {
    alignSelf: "center",
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  facebookBtn: {
    paddingTop: 16,
    marginTop: 4,
    width: getScreenWidth(),
    height: 62,
    backgroundColor: '#4267B2',
    borderRadius: 100,
    alignItems: 'center'
  },
  facebookImg: {
    height: getResponsiveSize(20),
    width: getResponsiveSize(16),
  },
  facebookBtnText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  oauthButton: {
    backgroundColor: Theme.colors.green,
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: Theme.sizes.boxBorderRadius,
    borderColor: "white",
    borderWidth: 0,
    shadowColor: "#00000020",
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  oauthButtonText: { color: "white", fontSize: 16, fontFamily: "rubik-medium" },
});

export default LoginScreen;
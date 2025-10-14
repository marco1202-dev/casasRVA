import React, { useContext, useState, useEffect, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import DlgSelectFileType from '../../components/dialogs/DlgSelectFileType';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
  Alert,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import {
  Avatar,
  Divider,
  TouchableHighlight,
  Box,
  Text,
} from "../../components";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { useLocalization } from "../../localization";
import { ProfileService } from "../../services";
import { Theme } from "../../theme";
import ImageCropPicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import { getImageUrl, getResponsiveSize, showToast } from "../../utils/AppUtils";
import NavigationNames from "../../navigations/NavigationNames";
import Global from "../../utils/Global";
import { SocketConext } from "../../context/SocketContext";
import CommonStyles from "../../styles/CommonStyles";
import { SCREEN_HOR_PADDING } from "../../constants";
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Clipboard from "@react-native-community/clipboard";


const ProfileScreen = () => {
  const { getString } = useLocalization();
  const navigation = useNavigation();
  const authContext = useContext(AuthenticationContext);
  const [userInfo, setUserInfo] = useState(authContext.user);
  const { setAgentInfo, agentInfo } = useContext(SocketConext)
  const [dlgFileSelectInfo, setDlgFileTypeInfo] = useState({
    show: false,
    onSelect: () => { },
    onHide: () => { }
  });

  const buildLinkAndSave = async (agent_id) => {
    const link = await dynamicLinks().buildShortLink({
      link: `http://casasrvapp.dyanmic.com?agent_id=${agent_id}`,
      ios: {
        bundleId: 'com.domain.casasrvapp',
        appStoreId: '12345678'
      },
      android: {
        packageName: 'com.casasrva'
      },
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: 'https://casasrvapp.page.link',
      // optional setup which updates Firebase analytics campaign
      // "banner". This also needs setting up before hand
      analytics: {
        campaign: 'banner',
      },
    });

    ProfileService.saveDynamicLink(Global.user?.id, link)
    .then(res => {
      let data = res.data;

      if (data) {
        setUserInfo({
          ...userInfo,
          dynamic_link: link
        });
      }
    });
  }

  useFocusEffect(
    useCallback(() => {
      if (Global.user) {
        ProfileService.getUserInfo(Global.user?.id).then((res) => {
          let data = res?.data;
          if (data?.error === 'LOGOUT') {
            authContext?.logout();
            navigation.navigate(NavigationNames.RootLoginScreen);
            return;
          }

          let dynamic_link = data?.dynamic_link;

          setUserInfo({ ...data });

          if (authContext.user?.role === 'client') {
            if (data?.agents?.length > 0) {
              Global.agentInfo = data.agents[0];
              setAgentInfo(Global.agentInfo);
            } else {
              Global.agentInfo = null;
              setAgentInfo(null)
            }
          }

          if (!dynamic_link && Global.user?.role === 'agent') {
            buildLinkAndSave(data?.id);
          }

        });
      }

      return () => {

      }
    }, [])
  )

  const onPressMenuItem = (menuVal) => {

    if (menuVal === 'favorites') {
      navigation.navigate(NavigationNames.ProfileTab_FavoriteScreen, { client_id: userInfo?.id });
    } else if (menuVal === 'my info') {
      navigation.navigate(NavigationNames.ProfileTab_ProfileEditScreen, { client_id: userInfo?.id });
    } else if (menuVal === 'agents') {
      navigation.navigate(NavigationNames.ProfileTab_AgentScreen, { user_id: userInfo?.id, agentList: userInfo?.agents ?? [] });
    } else if (menuVal === 'clients') {
      navigation.navigate(NavigationNames.ProfileTab_ClientScreen, { user_id: userInfo?.id, clientList: userInfo?.clients ?? [], role: 'agent' });
    } else if (menuVal === 'notifications') {
      navigation.navigate(NavigationNames.ProfileTab_NotificationScreen, { user_id: userInfo?.id });
    } else if (menuVal === 'appointments') {
      navigation.navigate(NavigationNames.ProfileTab_AppointmentScreen, { user_id: userInfo?.id, role: userInfo?.role });
    }
  };

  const onHideFileSelectTypeDlg = () => {
    setDlgFileTypeInfo({
      ...dlgFileSelectInfo,
      show: false
    });
  }

  const onSelectedFileType = (type) => {

    if (type === 'library') {
      ImageCropPicker.openPicker(
        {
          mediaType: 'photo',
          cropping: true,
          // includeBase64: true,
          width: 512,
          height: 512
        }).then(response => {
          onPickedImage(response)
        }).catch(e => {
          console.log(e)
        })
    } else if (type === 'camera') {
      ImageCropPicker.openCamera(
        {
          mediaType: 'photo',
          cropping: true,
          // includeBase64: true,
          width: 512,
          height: 512
        }).then(response => {
          onPickedImage(response)
        }).catch(e => {
          console.log(e)
        })
    }
  }

  const onUpdateImage = async (response) => {
    let uri = response?.path;
    if (uri !== "") {
      const avatar = await ProfileService.updateProfileImage(uri);
      setUserInfo({
        ...userInfo,
        avatar
      });
    }
  }

  const onPickedImage = (response) => {
    let origin = response;
    if (origin.width > 512) {
      const height = origin.height * 512 / origin.width;
      ImageResizer.createResizedImage(origin.path, 512, height, 'JPEG', 100, 0, undefined, undefined, undefined)
        .then(resizedImage => {
          // origin.path = resizedImage.uri.replace('file://', '');
          origin.path = resizedImage.uri;
          origin.width = resizedImage.width;
          origin.height = resizedImage.height;
          origin.size = resizedImage.size;

          onUpdateImage(origin);
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      onUpdateImage(origin);
    }
  };

  const onPressChangeImage = () => {
    setDlgFileTypeInfo({
      show: true,
      onSelect: (type) => onSelectedFileType(type),
      onHide: () => onHideFileSelectTypeDlg()
    })
  };

  return (
    <SafeAreaView style={styles.flex1} forceInset={{ top: "always" }}>
      <ScrollView
        style={styles.flex1}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.imageContent}>
          <Avatar
            style={styles.avatarContainerStyle}
            imageStyle={styles.avatarImageStyle}
            source={{
              uri: getImageUrl(userInfo.avatar),
            }}
          />

          <TouchableOpacity
            style={styles.changeImageButton}
            onPress={() => onPressChangeImage()}
          >
            <Box style={styles.changeImageButtonBox}>
              <Ionicons
                name="md-refresh"
                size={18}
                color={Theme.colors.primaryColor}
                style={{ marginTop: 2 }}
              />
            </Box>
          </TouchableOpacity>
        </View>
        <Text
          style={styles.nameText}
        >{userInfo.name}</Text>

        {userInfo?.role === 'agent' && !!userInfo?.dynamic_link &&
          <TouchableOpacity onPress={() => {
            Clipboard.setString(userInfo?.dynamic_link);
            Alert.alert("Copied successfully");
          }} style={[CommonStyles.flex_row, {
            justifyContent: 'center',
            paddingTop: getResponsiveSize(12),
            paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING * 2)
          }]}>
            <View>
              <FeatherIcon name="copy" color={Theme.colors.primaryColor} size={getResponsiveSize(30)} />
            </View>
            <View style={[CommonStyles.main_font_medium, {
              marginLeft: 10,
            }]}>
              <Text style={[CommonStyles.main_font_regular, { color: Theme.colors.primaryColor, fontSize: getResponsiveSize(16) }]}>
                {userInfo?.dynamic_link?.replace('https://', '')}
              </Text>
            </View>
          </TouchableOpacity>
        }


        <View style={{ marginTop: 24 }}>
          <TouchableHighlight
            onPress={() => onPressMenuItem('favorites')}
          >
            <View>
              <View style={styles.menuRowContent}>
                <View style={styles.iconContent}>
                  <Ionicons
                    name={'ios-heart'}
                    size={26}
                    color={Theme.colors.primaryColor}
                    style={{ alignSelf: "center" }}
                  />
                </View>
                <View style={styles.menuRowsContent}>
                  <Text style={styles.menuRowTitle}>{getString('Favorites')}</Text>
                  <Text style={styles.menuRowSubtitle}>
                    {getString('View All Favorites')}
                  </Text>
                </View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={24}
                  color={Theme.colors.primaryColor}
                  style={{
                    alignSelf: "center",
                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                  }}
                />
              </View>
              <Divider style={styles.divider} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={() => onPressMenuItem('notifications')}
          >
            <View>
              <View style={styles.menuRowContent}>
                <View style={styles.iconContent}>
                  <Ionicons
                    name={'md-notifications'}
                    size={26}
                    color={Theme.colors.primaryColor}
                    style={{ alignSelf: "center" }}
                  />
                </View>
                <View style={styles.menuRowsContent}>
                  <Text style={styles.menuRowTitle}>{getString('Notifications')}</Text>
                  <Text style={styles.menuRowSubtitle}>
                    {getString('View All Notifications')}
                  </Text>
                </View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={24}
                  color={Theme.colors.primaryColor}
                  style={{
                    alignSelf: "center",
                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                  }}
                />
              </View>
              <Divider style={styles.divider} />
            </View>
          </TouchableHighlight>

          {
            userInfo?.role === 'client' && agentInfo &&
            <>
              <TouchableHighlight
                onPress={() => onPressMenuItem('agents')}
              >
                <View>
                  <View style={styles.menuRowContent}>
                    <View style={styles.iconContent}>
                      <FontAwesome5Icon
                        name={'users'}
                        size={26}
                        color={Theme.colors.primaryColor}
                        style={{ alignSelf: "center" }}
                      />
                    </View>

                    <View style={styles.menuRowsContent}>
                      <Text style={styles.menuRowTitle}>{getString('My Agent')}</Text>
                      <Text style={styles.menuRowSubtitle}>
                        {getString('View Agent Info')}
                      </Text>
                    </View>
                    <Ionicons
                      name="ios-arrow-forward"
                      size={24}
                      color={Theme.colors.primaryColor}
                      style={{
                        alignSelf: "center",
                        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                      }}
                    />
                  </View>
                  <Divider style={styles.divider} />
                </View>
              </TouchableHighlight>
            </>
          }

          {
            userInfo?.clients?.length > 0 && userInfo?.role === 'agent' &&
            <>
              <TouchableHighlight
                onPress={() => onPressMenuItem('clients')}
              >
                <View>
                  <View style={styles.menuRowContent}>
                    <View style={styles.iconContent}>
                      <FontAwesome5Icon
                        name={'users'}
                        size={26}
                        color={Theme.colors.primaryColor}
                        style={{ alignSelf: "center" }}
                      />
                    </View>

                    <View style={styles.menuRowsContent}>
                      <Text style={styles.menuRowTitle}>{getString('My Clients')}</Text>
                      <Text style={styles.menuRowSubtitle}>
                        {getString('View All Clients')}
                      </Text>
                    </View>
                    <Ionicons
                      name="ios-arrow-forward"
                      size={24}
                      color={Theme.colors.primaryColor}
                      style={{
                        alignSelf: "center",
                        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                      }}
                    />
                  </View>
                  <Divider style={styles.divider} />
                </View>
              </TouchableHighlight>
            </>
          }

          <TouchableHighlight
            onPress={() => onPressMenuItem('my info')}
          >
            <View>
              <View style={styles.menuRowContent}>
                <View style={styles.iconContent}>
                  <AntDesignIcons
                    name={'form'}
                    size={26}
                    color={Theme.colors.primaryColor}
                    style={{ alignSelf: "center" }}
                  />
                </View>
                <View style={styles.menuRowsContent}>
                  <Text style={styles.menuRowTitle}>{getString('My Info')}</Text>
                  <Text style={styles.menuRowSubtitle}>
                    {getString('Change Profile Information')}
                  </Text>
                </View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={24}
                  color={Theme.colors.primaryColor}
                  style={{
                    alignSelf: "center",
                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                  }}
                />
              </View>
              <Divider style={styles.divider} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={() => onPressMenuItem('appointments')}
          >
            <View>
              <View style={styles.menuRowContent}>
                <View style={styles.iconContent}>
                  <FeatherIcon
                    name={'calendar'}
                    size={26}
                    color={Theme.colors.primaryColor}
                    style={{ alignSelf: "center" }}
                  />
                </View>
                <View style={styles.menuRowsContent}>
                  <Text style={styles.menuRowTitle}>{getString('My Appointments')}</Text>
                  <Text style={styles.menuRowSubtitle}>
                    {getString('See your upcoming appointments')}
                  </Text>
                </View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={24}
                  color={Theme.colors.primaryColor}
                  style={{
                    alignSelf: "center",
                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                  }}
                />
              </View>
              <Divider style={styles.divider} />
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
      <DlgSelectFileType {...dlgFileSelectInfo} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1 },
  flex1: { flex: 1 },
  scrollContainer: { paddingVertical: 16 },
  imageContent: { alignSelf: "center", marginTop: 36 },
  avatarContainerStyle: {
    borderRadius: 36,
    borderColor: Theme.colors.primaryColor,
    borderWidth: 0.75,
    overflow: "hidden",
  },
  avatarImageStyle: {
    width: 130,
    height: 130,
  },
  changeImageButton: {
    width: 28,
    height: 28,
    position: "absolute",
    bottom: -4,
    right: -4,
    zIndex: 10,
    borderRadius: Theme.sizes.boxBorderRadius,
    backgroundColor: "white",
  },
  changeImageButtonBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  nameText: {
    alignSelf: "center",
    fontSize: 22,
    fontFamily: "rubik-medium",
    marginTop: 16,
    color: Theme.colors.black,
  },
  daysText: {
    alignSelf: "center",
    fontSize: 14,
    marginTop: 6,
    color: Theme.colors.black,
  },
  menuRowContent: {
    flexDirection: "row",
    paddingStart: 12,
    paddingEnd: 16,
    paddingVertical: 16,
  },
  iconContent: {
    width: 32,
  },
  menuRowsContent: { paddingHorizontal: 8, flex: 1 },
  menuRowTitle: {
    fontSize: 17,
    textAlign: "justify",
  },
  menuRowSubtitle: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "justify",
  },
  divider: { marginStart: 46 },
});

export default ProfileScreen;

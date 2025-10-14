import React, { useContext, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

import DlgSelectFileType from '../../components/dialogs/DlgSelectFileType';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Alert
} from "react-native";

import {
    Avatar,
    Box,
    Text,
    PrimaryButton,
} from "../../components";
import { useLocalization } from "../../localization";
import { ProfileService } from "../../services";
import { Theme } from "../../theme";
import ImageCropPicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import { getDateObjFromStr, getDateTimeFormat, getImageUrl, getResponsiveSize } from "../../utils/AppUtils";
import CommonStyles from "../../styles/CommonStyles";
import { loginInfo, SCREEN_HOR_PADDING } from "../../constants";
import Colors from "../../styles/Colors";
import CommentInputContainer from "../../components/inputs/CommentInputContainer";
import DlgDateSelect from "../../components/dialogs/DlgDateSelect";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import ReactNativeModal from "react-native-modal";
import NavigationNames from "../../navigations/NavigationNames";

const ProfileEditScreen = () => {
    const { getString } = useLocalization();

    const navigation = useNavigation();
    const route = useRoute();
    const { logout } = useContext(AuthenticationContext);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [userInfo, setUserInfo] = useState(null);

    const [datePickerInfo, setDatePickerInfo] = useState({
        isOpen: false
    })

    const [dlgFileSelectInfo, setDlgFileTypeInfo] = useState({
        show: false,
        onSelect: () => { },
        onHide: () => { }
    });

    useEffect(() => {
        ProfileService.getDetailInfo(route.params?.client_id).then((user) => {
            setUserInfo({ ...user });
        });
    }, []);

    const onHideFileSelectTypeDlg = () => {
        setDlgFileTypeInfo({
            ...dlgFileSelectInfo,
            show: false
        });
    };

    const onPressUpdate = () => {
        // check
        if (!userInfo?.name) {
            Alert.alert(getString("Please fill Name Field"));
            return;
        }

        if (!userInfo?.email) {
            Alert.alert(getString("Please fill Email Field"));
            return;
        }

        // save 
        // ProfileService.updateProfileInfo()

        let request = {};
        let tempUser = { ...userInfo };
        if (tempUser?.info?.dob) {
            tempUser.info.dob = getDateTimeFormat(tempUser.info.dob, 'yyyy-MM-DD');
        }

        let withImage = false;

        if (!!tempUser?.newAvatar) {
            request = new FormData();
            let newAvatar = {
                uri: tempUser?.newAvatar,
                type: "image/jpg",
                name: "upload.jpg",
            };

            request.append('newAvatar', newAvatar);
            request.append('name', tempUser?.name);
            request.append('email', tempUser?.email);
            request.append('info', JSON.stringify(tempUser?.info));

            withImage = true;
        } else {
            request.name = tempUser?.name;
            request.email = tempUser?.email;
            request.info = tempUser?.info;
        }

        ProfileService.updateProfile(request, withImage)
            .then(async (user) => {
                loginInfo.email = tempUser?.email;

                Alert.alert("Successfully Updated!");
            })
            .catch(err => {
                console.log(err); ``
            })
    }

    const onHideDatePicker = () => {
        setDatePickerInfo({
            ...datePickerInfo,
            isOpen: false
        })
    };

    const onDeleteAccount = () => {
        let user_id = userInfo?.id;
        setShowConfirmModal(false);


        ProfileService.deleteAccount(user_id)
            .then(async (res) => {
                await logout();
                navigation.navigate(NavigationNames.RootLoginScreen);
            })
    }

    const onShowDatePicker = (val, type) => {
        setDatePickerInfo({
            ...datePickerInfo,
            isOpen: true,
            mode: "date",
            pickerVal: getDateObjFromStr(val),
            title: getString("Select DOB"),
            confirmAction: (newVal) => {
                onHideDatePicker();

                let tempInfo = userInfo;
                if (!tempInfo?.info) {
                    tempInfo.info = {};
                }

                tempInfo.info.dob = newVal;
                setUserInfo({ ...tempInfo });
            },
            cancelAction: () => onHideDatePicker()
        })
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
            let tempInfo = userInfo;
            tempInfo.newAvatar = uri;
            setUserInfo({
                ...tempInfo
            });
            // const avatar = await ProfileService.updateProfileImage(uri);
            // setUserInfo({
            //     ...userInfo,
            //     avatar
            // });
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
        <KeyboardAvoidingView style={styles.flex1} behavior={Platform.select({ ios: "padding", android: "height" })} forceInset={{ top: "always" }}>
            <ScrollView
                style={[styles.flex1, {
                    paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING),
                }]}
                contentContainerStyle={styles.scrollContainer}
            >
                <View style={[styles.imageContent, { marginBottom: getResponsiveSize(14) }]}>
                    {!!userInfo?.newAvatar ?
                        <Avatar
                            style={styles.avatarContainerStyle}
                            imageStyle={styles.avatarImageStyle}
                            source={{
                                uri: userInfo?.newAvatar,
                            }}
                        /> : <Avatar
                            style={styles.avatarContainerStyle}
                            imageStyle={styles.avatarImageStyle}
                            source={{
                                uri: getImageUrl(userInfo?.avatar),
                            }}
                        />
                    }

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

                <CommentInputContainer title={getString('Name')} isPrimary={true}>
                    <TextInput
                        placeholderTextColor={Theme.colors.gray}
                        placeholder={getString('Name here...')}
                        value={userInfo?.name}
                        onChangeText={(val) => {
                            setUserInfo({
                                ...userInfo,
                                name: val
                            })
                        }}
                        style={[CommonStyles.main_font_medium, { maxHeight: getResponsiveSize(100), paddingVertical: getResponsiveSize(6), flex: 1 }]}
                    />
                </CommentInputContainer>
                <CommentInputContainer title={getString('Email')} isPrimary={true}>
                    <TextInput
                        placeholderTextColor={Theme.colors.gray}
                        placeholder={getString('Email here...')}
                        value={userInfo?.email}
                        onChangeText={(val) => {
                            setUserInfo({
                                ...userInfo,
                                email: val
                            })
                        }}
                        style={[CommonStyles.main_font_medium, { maxHeight: getResponsiveSize(100), paddingVertical: getResponsiveSize(6), flex: 1 }]}
                    />
                </CommentInputContainer>

                <CommentInputContainer title={getString('Phone Number')}>
                    <TextInput
                        placeholderTextColor={Theme.colors.gray}
                        placeholder={getString('Phone Number...')}
                        value={userInfo?.info?.phone}
                        onChangeText={(val) => {
                            let tempInfo = userInfo;

                            if (!tempInfo.info) {
                                tempInfo.info = {};
                            }
                            tempInfo.info.phone = val;
                            setUserInfo({ ...tempInfo })
                        }}
                        style={[CommonStyles.main_font_medium, { maxHeight: getResponsiveSize(100), paddingVertical: getResponsiveSize(6), flex: 1 }]}
                    />
                </CommentInputContainer>
                <CommentInputContainer title={getString('DOB')} padding={10}>
                    <TouchableOpacity style={[CommonStyles.flex_row]}
                        onPress={() => onShowDatePicker(userInfo?.info?.dob, "purchase_date")}>
                        <FontAwesome5Icon name="calendar-alt" size={getResponsiveSize(22)}
                            color={userInfo?.info?.dob ? Colors.black : Colors.grey} />
                        <Text
                            style={[CommonStyles.main_font_medium, {
                                marginLeft: getResponsiveSize(12),
                                flex: 1, paddingVertical: getResponsiveSize(6),
                                color: userInfo?.info?.dob ? Colors.black : Colors.grey
                            }]}>{userInfo?.info?.dob ? getDateTimeFormat(userInfo?.info?.dob, 'MM/DD/yyyy') : 'Select DOB'}</Text>
                    </TouchableOpacity>
                </CommentInputContainer>
                <CommentInputContainer title={getString('Company')}>
                    <TextInput
                        placeholderTextColor={Theme.colors.gray}
                        placeholder={getString('Comany...')}
                        value={userInfo?.info?.company}
                        onChangeText={(val) => {
                            let tempInfo = userInfo;
                            if (!tempInfo.info) {
                                tempInfo.info = {};
                            }
                            tempInfo.info.company = val;
                            setUserInfo({ ...tempInfo })
                        }}
                        style={[CommonStyles.main_font_medium, { maxHeight: getResponsiveSize(100), paddingVertical: getResponsiveSize(6), flex: 1 }]}
                    />
                </CommentInputContainer>
                <TouchableOpacity style={{ marginTop: getResponsiveSize(16) }} onPress={() => setShowConfirmModal(true)}>
                    <Text style={[CommonStyles.main_font_medium, {
                        color: Theme.colors.primaryColor,
                        textDecorationLine: 'underline'
                    }]}>{getString("Delete My Account")}</Text>
                </TouchableOpacity>
            </ScrollView>
            <View style={[CommonStyles.flex_row, {
                paddingVertical: getResponsiveSize(16),
                paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING)
            }]}>
                <View style={[{ flex: 1, paddingRight: getResponsiveSize(8) }]}>
                    <PrimaryButton
                        buttonStyle={{ backgroundColor: Colors.grey }}
                        title={getString("Cancel")}
                        onPress={() => { navigation.goBack() }}
                    />
                </View>
                <View style={[{ flex: 1, paddingRight: getResponsiveSize(8) }]}>
                    <PrimaryButton
                        style={{}}
                        title={getString("Update")}
                        onPress={() => onPressUpdate()}
                    />
                </View>
            </View>
            <DlgSelectFileType {...dlgFileSelectInfo} />
            <DlgDateSelect
                {...datePickerInfo}
            />
            <ReactNativeModal
                isVisible={showConfirmModal}
                swipeDirection={null}
                style={styles.modal}
                propagateSwipe
                onSwipeComplete={() => setShowConfirmModal(false)}
                onBackdropPress={() => setShowConfirmModal(false)}
                onBackButtonPress={() => setShowConfirmModal(false)}
            >
                <View style={[{
                    paddingVertical: getResponsiveSize(16),
                    paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING),
                    backgroundColor: Colors.white,
                    borderRadius: getResponsiveSize(20),
                    marginBottom: getResponsiveSize(120)
                }]}>
                    <Text style={[CommonStyles.main_font_medium, {
                        marginTop: getResponsiveSize(20),
                        fontSize: getResponsiveSize(20),
                        color: Theme.colors.primaryColor,
                        textAlign: 'center'
                    }]}>
                        {getString("Are you sure you want to permanently delete your account?")}
                    </Text>
                    <View style={[CommonStyles.flex_row, { marginTop: getResponsiveSize(30) }]}>
                        <View style={[{ flex: 1, paddingRight: getResponsiveSize(8) }]}>
                            <PrimaryButton
                                buttonStyle={{ backgroundColor: Colors.grey }}
                                title={getString("Cancel")}
                                onPress={() => setShowConfirmModal(false)}
                            />
                        </View>
                        <View style={[{ flex: 1, paddingRight: getResponsiveSize(8) }]}>
                            <PrimaryButton
                                style={{}}
                                title={getString("Yes")}
                                onPress={() => onDeleteAccount()}
                            />
                        </View>
                    </View>
                </View>

            </ReactNativeModal>
        </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1 },
    flex1: { flex: 1 },
    scrollContainer: { paddingVertical: 8 },
    imageContent: { alignSelf: "center", marginTop: 12 },
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
    textInput: {
        fontSize: 15,
        borderColor: Colors.grey,
        borderRadius: getResponsiveSize(6),
        borderWidth: getResponsiveSize(1),
        paddingHorizontal: getResponsiveSize(12),
        height: Theme.sizes.inputHeight,
        fontFamily: "rubik-regular",
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

export default ProfileEditScreen;

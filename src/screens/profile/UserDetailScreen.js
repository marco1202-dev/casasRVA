import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
    View,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView
} from "react-native";

import {
    Avatar,
    Text
} from "../../components";
import { useLocalization } from "../../localization";
import { ProfileService } from "../../services";
import { Theme } from "../../theme";
import { getImageUrl, getResponsiveSize } from "../../utils/AppUtils";
import CommonStyles from "../../styles/CommonStyles";
import { SCREEN_HOR_PADDING } from "../../constants";
import Colors from "../../styles/Colors";
import CommentInputContainer from "../../components/inputs/CommentInputContainer";

const UserDetailScreen = () => {
    const { getString } = useLocalization();
    const route = useRoute();

    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        ProfileService.getDetailInfo(route.params?.user_id).then((user) => {
            setUserInfo({ ...user });
        });
    }, []);

    return (
        <KeyboardAvoidingView style={styles.flex1} behavior={Platform.select({ ios: "padding", android: "height" })} forceInset={{ top: "always" }}>
            <ScrollView
                style={[styles.flex1, {
                    paddingHorizontal: getResponsiveSize(SCREEN_HOR_PADDING),
                }]}
                contentContainerStyle={styles.scrollContainer}
            >
                <View style={[styles.imageContent, { marginBottom: getResponsiveSize(14) }]}>
                    <Avatar
                        style={styles.avatarContainerStyle}
                        imageStyle={styles.avatarImageStyle}
                        source={
                            !!userInfo?.avatar ?
                                {
                                    uri: getImageUrl(userInfo?.avatar),
                                } : require('../../../assets/default-avatar.png')}
                    />
                </View>
                <CommentInputContainer title={getString('Name')} isPrimary={true}>
                    <Text
                        placeholder={getString('Name here...')}
                        style={[CommonStyles.main_font_medium, { maxHeight: getResponsiveSize(100), paddingVertical: getResponsiveSize(6), flex: 1 }]}
                    >{userInfo?.name}</Text>
                </CommentInputContainer>
                <CommentInputContainer title={getString('Email')} isPrimary={true}>
                    <Text
                        style={[CommonStyles.main_font_medium, { maxHeight: getResponsiveSize(100), paddingVertical: getResponsiveSize(6), flex: 1 }]}
                    >{userInfo?.email}</Text>
                </CommentInputContainer>
                {
                    !!userInfo?.info?.phone &&
                    <CommentInputContainer title={getString('Phone Number')}>
                        <Text
                            style={[CommonStyles.main_font_medium, { maxHeight: getResponsiveSize(100), paddingVertical: getResponsiveSize(6), flex: 1 }]}
                        >{userInfo?.info?.phone}</Text>
                    </CommentInputContainer>
                }

                {
                    !!userInfo?.info?.company &&
                    <CommentInputContainer title={getString('Company')}>
                        <Text
                            style={[CommonStyles.main_font_medium, { maxHeight: getResponsiveSize(100), paddingVertical: getResponsiveSize(6), flex: 1 }]}
                        >{userInfo?.info?.company}</Text>
                    </CommentInputContainer>
                }

            </ScrollView>
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

export default UserDetailScreen;

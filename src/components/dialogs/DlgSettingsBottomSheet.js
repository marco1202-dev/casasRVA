import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { ReactNativeModal } from "react-native-modal";

import { Divider, Text } from "..";
import { useLocalization } from "../../localization";
import { Theme } from "../../theme";
import { getLang } from "../../constants";
import { getNotificationSetting, setNotificationSetting } from "../../utils/AppUtils";
import BtnSelect from "../buttons/BtnSelect";
import Global from "../../utils/Global";

const DlgSettingsBottomSheet = (props) => {
  const [notificationVal, setNotificationVal] = useState(Global.notificationSetting);

  useEffect(() => {
    const fetchSettingInfo = async () => {
      Global.notificationSetting = await getNotificationSetting();
      setNotificationVal(Global.notificationSetting);
    }

    if (Global.notificationSetting === '') {
      fetchSettingInfo();
    }
  }, []);

  const { getString, currentLanguage, changeLanguage } = useLocalization();
  return (
    <ReactNativeModal
      isVisible={props.isVisible}
      swipeDirection="down"
      style={styles.modal}
      onSwipeComplete={props.onDismissModal}
      onBackdropPress={props.onDismissModal}
      onBackButtonPress={props.onDismissModal}
    >
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.modalContainer}>
          <View style={styles.langRow}>
            <Text style={styles.langText}>
              {getString("Selected Language")}
            </Text>
            <View style={styles.langBoxes}>
              <BtnSelect
                title="EN"
                isSelected={currentLanguage() === "en"}
                onPress={() => changeLanguage(getLang("en"))}
              />
              <BtnSelect
                title="ES"
                isSelected={currentLanguage() === "es"}
                onPress={() => changeLanguage(getLang("es"))}
              />
              {/* <LangButton
                title="AR"
                isSelected={currentLanguage() === "ar"}
                onPress={() => changeLanguage(getLang("ar"))}
              /> */}
            </View>
          </View>
          <Divider style={{ marginVertical: 12 }} />

          <View style={styles.langRow}>
            <Text style={styles.langText}>
              {getString("Notifications")}
            </Text>
            <View style={styles.langBoxes}>
              <BtnSelect
                title={getString("Yes")}
                isSelected={notificationVal === 'yes'}
                onPress={async () => {
                  Global.notificationSetting = 'yes';
                  await setNotificationSetting(Global.notificationSetting);
                  setNotificationVal(Global.notificationSetting);
                }}
              />
              <BtnSelect
                title={getString("No")}
                isSelected={notificationVal === 'no'}
                onPress={async () => {
                  Global.notificationSetting = 'no';
                  await setNotificationSetting(Global.notificationSetting);
                  setNotificationVal(Global.notificationSetting);
                }}
              />
            </View>
          </View>
          <Divider style={{ marginVertical: 12 }} />
        </View>
      </SafeAreaView>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  safeAreaContainer: {
    backgroundColor: "white",
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    minHeight: 300,
  },
  modalContainer: {
    padding: 24,
  },
  langContainer: {
    width: 36,
    height: 36,
    backgroundColor: Theme.colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  langBoxes: { flexDirection: "row" },
  langText: {
    flex: 1,
    fontFamily: "rubik-medium",
    fontSize: 15,
    color: Theme.colors.black,
  },
  langBoxTitleText: {
    color: "white",
    fontFamily: "rubik-medium",
    fontSize: 13,
  },
});

export default DlgSettingsBottomSheet;

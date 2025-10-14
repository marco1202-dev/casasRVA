import React from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ReactNativeModal } from "react-native-modal";
import { getImageUrl, getResponsiveSize } from "../../utils/AppUtils";
import Colors from "../../styles/Colors";

const DlgPhotoViewer = (props) => {
  return (
    <ReactNativeModal
      isVisible={props.visible}
      backdropColor="black"
      onBackButtonPress={props.onSwipeDown}
      style={{ margin: 0, padding: 0, backgroundColor: "black " }}
      animationIn="fadeIn"
      animationOut="fadeOut"
    >
      <TouchableOpacity onPress={() => props.onSwipeDown()} style={{
        zIndex: 10000,
        position: 'absolute',
        right: getResponsiveSize(20),
        top: getResponsiveSize(34)
      }}>
        <MaterialIcons name="close" size={getResponsiveSize(30)} color={Colors.white} />
      </TouchableOpacity>
      <ImageViewer
        enableSwipeDown
        swipeDownThreshold={400}
        onSwipeDown={props.onSwipeDown}
        loadingRender={() => {
          return (
            <ActivityIndicator size="large" color={'#808080'} />
          )
        }}
        imageUrls={props.imageNames.map((item) => {
          return {
            url: props.isFullUrl ? item : getImageUrl(item),
          };
        })}
        footerContainerStyle={styles.footerContainerStyle}
        backgroundColor="#000000CC"
        index={props.selectedImageIndex}
        onChange={props.onChange}
      />

    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  footerContainerStyle: {
    backgroundColor: "#000000AA",
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default DlgPhotoViewer;

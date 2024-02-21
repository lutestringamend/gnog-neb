import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, staticDimensions, dimensions } from "../../styles/base";
import Button from "../Button/Button";

const modalWidth = dimensions.fullWidthAdjusted - 2 * staticDimensions.marginHorizontal;
const modalHeight = (modalWidth * 401) / 299;
const extendedModalHeight = (modalWidth * 455) / 299;
const imageWidth = modalWidth - 2 * staticDimensions.marginHorizontal;

const ModalView = (props) => {
  const {
    title,
    text,
    image,
    modalAspectRatio,
    imageAspectRatio,
    hideClose,
    buttonSubmit,
    buttonClose,
    loading,
    style,
  } = props;

  const onPress = (e) => {
    if (!(props?.onPress === undefined || props?.onPress === null)) {
      props?.onPress(e);
    }
  };

  const setModal = (e) => {
    if (!(props?.setModal === undefined || props?.setModal === null)) {
      props?.setModal(e);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setModal((modal) => !modal)}
    >
      <BlurView
        intensity={5}
        style={[
          styles.container,
          {
            opacity: 0.97,
          },
        ]}
      >
        <View
          style={[
            styles.containerModal,
            {
              top:
                (dimensions.fullHeight -
                  (modalAspectRatio
                    ? modalWidth / modalAspectRatio
                    : buttonSubmit
                      ? extendedModalHeight
                      : modalHeight)) /
                  2 -
                40,
              bottom:
                (dimensions.fullHeight -
                  (modalAspectRatio
                    ? modalWidth / modalAspectRatio
                    : buttonSubmit
                      ? extendedModalHeight
                      : modalHeight)) /
                  2 +
                40,
              height: modalAspectRatio
                ? modalWidth / modalAspectRatio
                : buttonSubmit
                  ? extendedModalHeight
                  : modalHeight,
              start: (dimensions.fullWidth - modalWidth) / 2,
              end: (dimensions.fullWidth - modalWidth) / 2,
            },
            style ? style : null,
          ]}
        >
          {hideClose ? null : (
            <TouchableOpacity
              onPress={() => setModal(false)}
              style={styles.containerClose}
            >
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={colors.textInputText}
              />
            </TouchableOpacity>
          )}

          {image ? (
            <Image
              source={
                image ? image : require("../../assets/verified.png")
              }
              contentFit="contain"
              style={[
                styles.image,
                {
                  width: imageWidth,
                  height: imageAspectRatio
                    ? imageWidth / imageAspectRatio
                    : imageWidth,
                },
              ]}
            />
          ) : null}

          <View style={styles.containerText}>
            <Text allowFontScaling={false} style={styles.textHeader}>
              {title}
            </Text>
            <Text allowFontScaling={false} style={styles.text}>
              {text}
            </Text>
          </View>
          {buttonSubmit ? (
            <Button
              text={buttonSubmit}
              style={[styles.button, { marginBottom: 10 }]}
              loading={loading}
              onPress={() => onPress()}
            />
          ) : null}
          <Button
            inverted={buttonSubmit ? true : false}
            bordered={buttonSubmit ? true : false}
            borderColor={colors.grey_separator}
            text={buttonClose ? buttonClose : "OK"}
            style={styles.button}
            onPress={() => setModal(false)}
          />
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    start: 0,
    end: 0,
    bottom: 0,
    width: dimensions.fullWidth,
    height: dimensions.fullHeight,
    zIndex: 100,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  containerModal: {
    width: modalWidth,
    height: modalHeight,
    position: "absolute",
    start: staticDimensions.marginHorizontal,
    end: staticDimensions.marginHorizontal,
    backgroundColor: colors.white,
    alignItems: "center",
    padding: staticDimensions.marginHorizontal,
    borderWidth: 0.5,
    borderColor: colors.daclen_grey_light,
    borderRadius: 8,
  },
  containerClose: {
    alignSelf: "flex-end",
    backgroundColor: "transparent",
  },
  containerText: {
    backgroundColor: "transparent",
    flex: 1,
    marginVertical: 10,
  },
  textHeader: {
    backgroundColor: "transparent",
    fontFamily: "Poppins-SemiBold",
    fontSize: 18 * dimensions.fullWidthAdjusted / 430,
    lineHeight: 28 * dimensions.fullWidthAdjusted / 430,
    color: colors.black,
    textAlign: "center",
  },
  text: {
    backgroundColor: "transparent",
    fontFamily: "Poppins-Light",
    fontSize: 12 * dimensions.fullWidthAdjusted / 430,
    color: colors.black,
    marginTop: 12,
    lineHeight: 20 * dimensions.fullWidthAdjusted / 430,
    textAlign: "center",
  },
  image: {
    backgroundColor: "transparent",
    alignSelf: "center",
    marginTop: 10,
  },
  button: {
    width: imageWidth,
  },
});

export default ModalView;

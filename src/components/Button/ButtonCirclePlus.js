import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors, staticDimensions } from "../../styles/base";

const ButtonCirclePlus = (props) => {
  function onPress() {
    if (!(props?.onPress === undefined || props?.onPress === null)) {
      props?.onPress();
    }
  }

  return (
    <TouchableOpacity
      disabled={props?.disabled ? props?.disabled : false}
      style={styles.containerAdd}
      onPress={() => onPress()}
    >
      <View style={styles.containerAddInner}>
        <MaterialCommunityIcons
          name="plus"
          color={colors.buttonPrimary}
          size={28}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerAdd: {
    position: "absolute",
    zIndex: 12,
    end: staticDimensions.marginHorizontal,
    bottom: staticDimensions.marginHorizontal,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.daclen_black,
    justifyContent: "center",
    alignItems: "center",
  },
  containerAddInner: {
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

export default ButtonCirclePlus;

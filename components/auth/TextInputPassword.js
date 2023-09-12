import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../../styles/base";

function TextInputPassword(props) {
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  return (
    <View
      style={[
        props?.style,
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
      ]}
    >
      <TextInput
        secureTextEntry={isPasswordSecure}
        style={{
          flex: 1,
          fontFamily: "Poppins", fontSize: props?.style.fontSize,
          height: "100%",
          marginEnd: 10,
        }}
        onChangeText={(text) => props?.onChangeText(text)}
      />
      <TouchableOpacity onPress={() => setIsPasswordSecure(!isPasswordSecure)}>
        <MaterialCommunityIcons
          name={isPasswordSecure ? "eye-off" : "eye"}
          size={24}
          color={colors.daclen_gray}
        />
      </TouchableOpacity>
    </View>
  );
}

export default TextInputPassword;

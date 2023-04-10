import React from "react";
import { TouchableOpacity, View, TextInput } from "react-native";

export default function BSTextInput(props) {
  return (
    <TouchableOpacity onPress={props?.onPress} disabled={props?.disabled}>
      <View pointerEvents="none">
        <TextInput
          value={props?.value ? props?.value : "Tekan untuk memilih"}
          style={props?.style}
          onChangeText={props?.onChangeText}
        />
      </View>
    </TouchableOpacity>
  );
}

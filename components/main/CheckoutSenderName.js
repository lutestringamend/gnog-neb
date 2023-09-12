import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RadioGroup from "react-native-radio-buttons-group";
import { colors } from "../../styles/base";

const CheckoutSenderName = ({ senderNameChoices, onPressRadioButtonSenderName }) => {
  return (
    <View style={styles.containerInfo}>
      <Text style={styles.textCompulsory}>Kirim paket atas nama*</Text>
      <RadioGroup
        radioButtons={senderNameChoices}
        onPress={onPressRadioButtonSenderName}
        containerStyle={styles.containerRadio}
      />
    </View>
  );
};

/*
senderName, setSenderName, 
      <View style={styles.containerPrivacy}>
        <Text style={styles.textUid}>
          Anda bisa mengganti Nama Pengirim yang akan dipakai dalam delivery.
        </Text>
      </View>
      <TextInput
        value={senderName}
        style={styles.textInput}
        onChangeText={(name) => setSenderName(name)}
      />

        containerPrivacy: {
    marginVertical: 12,
    marginHorizontal: 20,
    alignItems: "center",
  },
    textUid: {
    fontFamily: "Poppins", fontSize: 12,
    color: colors.daclen_gray,
    textAlign: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.daclen_gray,
    borderRadius: 4,
    padding: 10,
    marginTop: 2,
    marginHorizontal: 20,
    marginBottom: 20,
    fontFamily: "Poppins", fontSize: 14,
  },
*/

const styles = StyleSheet.create({
  containerInfo: {
    backgroundColor: "transparent",
  },
  containerRadio: {
    marginTop: 12,
    marginHorizontal: 20,
    backgroundColor: "transparent",
    alignItems: "flex-start",
  },
  textCompulsory: {
    color: colors.daclen_orange,
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    marginTop: 20,
    marginHorizontal: 20,
  },
});

export default CheckoutSenderName;

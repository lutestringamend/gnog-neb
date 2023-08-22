import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors } from "../../styles/base";

const CheckoutSenderName = ({ senderName, setSenderName }) => {
  return (
    <View style={styles.containerInfo}>
      <View style={styles.containerPrivacy}>
        <Text style={styles.textUid}>
          Anda bisa mengganti Nama Pengirim yang akan dipakai dalam delivery.
        </Text>
      </View>

      <Text style={styles.textCompulsory}>Nama Pengirim*</Text>
      <TextInput
        value={senderName}
        style={styles.textInput}
        onChangeText={(name) => setSenderName(name)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerInfo: {
    backgroundColor: "transparent",
  },
  containerPrivacy: {
    marginVertical: 12,
    marginHorizontal: 20,
    alignItems: "center",
  },
  textCompulsory: {
    color: colors.daclen_orange,
    fontSize: 12,
    fontWeight: "bold",
    marginHorizontal: 20,
  },
  textUid: {
    fontSize: 12,
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
    fontSize: 14,
  },
});

export default CheckoutSenderName;

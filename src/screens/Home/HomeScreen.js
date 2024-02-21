import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, ScrollView, Alert } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

import { colors, staticDimensions } from "../../styles/base";
import HeaderBar from "../../components/Header/HeaderBar";
import Button from "../../components/Button/Button";
import TextInputLabel from "../../components/textinputs/TextInputLabel";
import Checkbox from "../../components/checkbox/Checkbox";
import TextCheckbox from "../../components/checkbox/TextCheckbox";
import AlertBox from "../../components/alert/AlertBox";

const HomeScreen = (props) => {
  const { token, currentUser } = props;
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [error, setError] = useState("Kode OTP berhasil dikirim.");
  const [check, setCheck] = useState(false);
  const [checkError, setCheckError] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar title="Daclen" />
      <ScrollView style={styles.containerScroll}>
        <Text>Template Screen</Text>
        <Button
          text="BUTTON"
          style={{ marginHorizontal: staticDimensions.marginHorizontal }}
        />
        <Button
          inverted
          bordered
          text="BUTTON"
          style={{ marginHorizontal: staticDimensions.marginHorizontal }}
        />
        <Button
          disabled
          text="BUTTON"
          style={{ marginHorizontal: staticDimensions.marginHorizontal }}
        />
        <TextInputLabel
          label="Isi Nama"
          placeholder="Masukkan nama Anda"
          value={name}
          setText={(e) => setName(e)}
          containerStyle={{ margin: staticDimensions.marginHorizontal }}
        />
        <TextInputLabel
          label="Isi Nama"
          placeholder="Masukkan nama Anda"
          value={name}
          error="Nama salah"
          setText={(e) => setName(e)}
          containerStyle={{ margin: staticDimensions.marginHorizontal }}
        />

        <TextCheckbox
          style={{ margin: staticDimensions.marginHorizontal }}
          active={check}
          onPress={() => setCheck((check) => !check)}
          error={checkError}
          textComponent={
            <Text allowFontScaling={false} style={[styles.text, { color: checkError ? colors.daclen_danger : colors.daclen_black_old }]}>
                Saya setuju dengan Syarat dan Ketentuan Daclen dan telah membaca Kebijakan Privasi.
            </Text>
          }
        />
        
      </ScrollView>
      <AlertBox
        text={error}
        isInfo
        success={false}
        onClose={() => setError(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    width: "100%",
  },
  containerScroll: {
    backgroundColor: "transparent",
  },
  
  text: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: colors.daclen_black,
  }
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
});

/*const mapDispatchProps = (dispatch) =>
    bindActionCreators(
      {
      },
      dispatch,
    );*/

export default connect(mapStateToProps, null)(HomeScreen);

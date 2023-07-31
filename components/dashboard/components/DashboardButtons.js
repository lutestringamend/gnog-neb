import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Linking,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { colors, staticDimensions } from "../../../styles/base";
import { openWhatsapp } from "../../whatsapp/Whatsapp";
import { adminWA, adminWAtemplate } from "../../profile/constants";
import { commissionpointpdf, mainhttp, webdashboard } from "../../../axios/constants";

const DashboardButtons = ({ userId, username }) => {
  const navigation = useNavigation();

  function openDaclenCare() {
    let template = adminWAtemplate;
    if (!(username === undefined || username === null)) {
      template = template.replace("#USERNAME#", username);
    }
    if (!(userId === undefined || userId === null)) {
      template = template.replace("#USERID#", userId);
    }
    template = template.replace("#PLATFORM#", Platform.OS);
    console.log("Daclen care intro", template);
    openWhatsapp(adminWA, template);
  }

  function openKodeEtik() {
    Linking.openURL(mainhttp);
  }

  function openBlog() {
    navigation.navigate("BlogFeed");
  }

  function openTutorial() {
    Linking.openURL(mainhttp);
  }

  function openExplanation() {
    Linking.openURL(mainhttp);
  }

  function openWebDashboard() {
    Linking.openURL(webdashboard);
  }

  function openCatalog() {
    Linking.openURL(commissionpointpdf);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.containerVertical, { marginEnd: 10 }]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => openDaclenCare()}
        >
          <Text style={styles.textButton}>{`DACLEN CARE`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => openKodeEtik()}>
          <Text style={styles.textButton}>{`KODE ETIK`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => openBlog()}>
          <Text style={styles.textButton}>{`BLOG`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => openTutorial()}>
          <Text style={styles.textButton}>{`TUTORIAL`}</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.containerVertical, { marginStart: 10 }]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => openExplanation()}
        >
          <Text style={styles.textButton}>{`PENJELASAN\nBISNIS`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => openWebDashboard()}
        >
          <Text style={styles.textButton}>{`DASHBOARD\nWEBSITE`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => openCatalog()}
        >
          <Text style={styles.textButton}>{`KATALOG\nHADIAH`}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    marginBottom: staticDimensions.pageBottomPadding,
    marginHorizontal: 20,
  },
  containerVertical: {
    flex: 1,
    backgroundColor: "transparent",
  },
  button: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: colors.daclen_light,
    alignSelf: "center",
    opacity: 0.9,
    backgroundColor: colors.daclen_lightgrey_button,
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: 160,
    marginBottom: 12,
  },
  textButton: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.daclen_light,
  },
});

export default DashboardButtons;

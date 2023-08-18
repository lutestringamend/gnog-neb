import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import PDFReader from "@hashiprobr/expo-pdf-reader";
import { colors } from "../../styles/base";

function ErrorScreen({ title, message, uri }) {
  return (
    <SafeAreaView style={styles.container}>
      <MainHeader title={title} icon="arrow-left" />
      <ErrorView
        error={message}
        onOpenExternalLink={() => openExternalLink(uri)}
      />
    </SafeAreaView>
  );
}

function openExternalLink(uri) {
  if (uri !== null && uri !== undefined) {
    Linking.openURL(uri);
  }
}

const PDFViewer = (props) => {
  const title = props.route.params?.title ? props.route.params?.title : "Daclen";
  const uri = props.route.params?.uri ? props.route.params?.uri : null;
  const content = props.route.params?.content
    ? props.route.params?.content
    : null;
  props.navigation.setOptions({
    title,
    headerShown: true,
  });

  try {
    return (
      <SafeAreaView style={styles.container}>
        <PDFReader source={uri ? { uri } : content} />
      </SafeAreaView>
    );
  } catch (e) {
    console.error(e);
    sentryLog(e);
    return <ErrorScreen title={title} message="Baca PDF di website Daclen" uri={uri} />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
  },
});

export default PDFViewer;

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '../../styles/base';

export default function ReactMap(props) {
  return (
    <View style={[styles.container, props?.style ? props?.style : null]}>
        <Text style={styles.text}>MapView tidak disupport di web</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    backgroundColor: colors.daclen_light,
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
    color: colors.daclen_black,
  },
});
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { colors } from "../../styles/base";
import { defaultRegion } from "../address/constants";
import { checkIfCoordIsStringThenParse } from "../address";
import { sentryLog } from "../../sentry";
import { defaultlatitude, defaultlatitudedelta, defaultlongitude, defaultlongitudedelta } from "../../axios/constants";

const { width, height } = Dimensions.get("window");


export default function ReactMap(props) {
  const [region, setRegion] = useState({
    latitude: defaultlatitude,
    longitude: defaultlongitude,
    latitudeDelta: defaultlatitudedelta,
    longitudeDelta: defaultlongitudedelta,
  });
  const [showRegion, setShowRegion] = useState(false);
  const ref = useRef();
  const { location, moving, initialRegion, regionFromPlaces } = props;

  useEffect(() => {
    if (
      initialRegion === null ||
      initialRegion?.latitude === undefined ||
      initialRegion?.longitude === undefined ||
      initialRegion?.latitude === null ||
      initialRegion?.longitude === null
    ) {
      return;
    }
    if (
      initialRegion?.latitude === defaultRegion?.latitude &&
      initialRegion?.longitude === defaultRegion?.longitude &&
      !regionFromPlaces
    ) {
      return;
    }
    setRegion(initialRegion);
    //setMainRegion(initialRegion);
    //ref.current.animateToRegion(initialRegion, 1000);
    //onRegionChangeComplete(initialRegion);
  }, [initialRegion]);

  function onRegionChange(e) {
    if (
      initialRegion === undefined ||
      initialRegion === null ||
      props.onRegionChange === undefined
    ) {
      return;
    }
    props.onRegionChange(e);
  }

  function onRegionChangeComplete(e) {
    if (props.onRegionChangeComplete !== undefined) {
      props.onRegionChangeComplete(e);
    }
  }

  try {
    function resetLocation() {
      try {
        props.onRegionChange(location?.coords);
        if (location === null || location?.coords === undefined || location?.coords?.latitude === undefined || location?.coords?.longitude === undefined) {
          ref.current.animateToRegion(
            {
              latitude: checkIfCoordIsStringThenParse(defaultlatitude),
              longitude: checkIfCoordIsStringThenParse(defaultlongitude),
              latitudeDelta: defaultlatitudedelta,
              longitudeDelta: defaultlongitudedelta,
            },
            1000
          );
        } else {
          console.log("initial location coords", location?.coords);
          ref.current.animateToRegion(
            {
              latitude: checkIfCoordIsStringThenParse(location?.coords?.latitude),
              longitude: checkIfCoordIsStringThenParse(location?.coords?.longitude),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000
          );
          }
      } catch (err) {
        console.error(err);
        sentryLog(err);
        ref.current.animateToRegion(
          {
            latitude: checkIfCoordIsStringThenParse(defaultlatitude),
            longitude: checkIfCoordIsStringThenParse(defaultlongitude),
            latitudeDelta: defaultlatitudedelta,
            longitudeDelta: defaultlongitudedelta,
          },
          1000
        );
      }
    }

    return (
      <View style={[styles.container, props?.style ? props.style : null]}>
        <MapView
          ref={ref}
          provider={PROVIDER_GOOGLE}
          style={[styles.maps, { width, height }]}
          initialRegion={defaultRegion}
          region={region}
          showsUserLocation={true}
          onRegionChange={(e) => onRegionChange(e)}
          onRegionChangeComplete={(e) => onRegionChangeComplete(e)}
        />

        <TouchableOpacity
          onPress={() => setShowRegion((showRegion) => !showRegion)}
          disabled={Platform.OS !== "web"}
          style={styles.marker}
        >
          {showRegion ? (
            <Text allowFontScaling={false} style={styles.textLog}>{JSON.stringify(region)}</Text>
          ) : (
            <MaterialCommunityIcons
              name="map-marker"
              size={48}
              color={colors.daclen_blue}
              style={styles.marker}
            />
          )}
        </TouchableOpacity>

        {location === null || moving ? null : (
          <TouchableOpacity
            style={styles.markerReset}
            onPress={() => resetLocation()}
          >
            <MaterialCommunityIcons
              name="target"
              size={32}
              color={colors.daclen_gray}
              style={{ backgroundColor: "transparent" }}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  } catch (e) {
    console.error(e);
    return (
      <View style={styles.container}>
        <Text allowFontScaling={false} style={styles.text}>{e.toString()}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.daclen_light,
    justifyContent: "center",
    alignItems: "center",
  },
  maps: {
    position: "absolute",
    top: 0,
    start: 0,
    bottom: 0,
    end: 0,
    zIndex: 1,
  },
  text: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: colors.daclen_danger,
    width: "100%",
    padding: 10,
    marginHorizontal: 20,
    color: colors.daclen_light,
  },
  marker: {
    zIndex: 4,
    elevation: 10,
    backgroundColor: "transparent",
  },
  markerReset: {
    position: "absolute",
    bottom: 180,
    end: 10,
    zIndex: 5,
    elevation: 10,
    backgroundColor: colors.white,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textLog: {
    zIndex: 6,
    elevation: 12,
    backgroundColor: colors.daclen_light,
    padding: 10,
    color: colors.daclen_gray,
    fontFamily: "Poppins", fontSize: 12,
  },
});

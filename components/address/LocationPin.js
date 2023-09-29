import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import ReactMap from "../maps/ReactMap";
import { colors } from "../../styles/base";
import {
  checkIfCoordIsStringThenParse,
  getAddressText,
  getKecamatanFromPlacesData,
  getLocales,
  initializeLocation,
  processLocalesIntoAddressData,
} from ".";
import { updateReduxRajaOngkirWithKey } from "../../axios/address";
import { defaultRegion, mapplacesplaceholder } from "./constants";
import { sentryLog } from "../../sentry";
import { defaultcountry, googleAPIkey } from "../../axios/constants";
import AddressData from "./AddressData";

const LocationPin = (props) => {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addressProcessing, setAddressProcessing] = useState(false);
  const [text, setText] = useState(null);
  const [addressText, setAddressText] = useState(null);
  const [regionText, setRegionText] = useState(null);
  const [locale, setLocale] = useState(null);

  const [moving, setMoving] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [initialRegion, setInitialRegion] = useState(
    props.route.params?.savedRegion
      ? props.route.params?.savedRegion
      : defaultRegion
  );
  const [region, setRegion] = useState(null);
  const [regionFromPlaces, setRegionFromPlaces] = useState(false);
  const [placesInput, setPlacesInput] = useState("");
  const isNew = props.route.params?.isNew ? props.route.params?.isNew : false;
  const isDefault = props.route.params?.isDefault
    ? props.route.params?.isDefault
    : false;
  const addressData = props.route.params?.addressData
    ? props.route.params?.addressData
    : AddressData;
  const [kecamatan, setKecamatan] = useState({
    data: addressData?.kecamatan_name,
    detail: addressData?.kecamatan_name,
    dataAlamat: null,
    detailAlamat: null,
  });
  const rbInput = useRef();
  const navigation = useNavigation();

  /*useEffect(() => {
    checkLocation();
  }, []);*/

  const checkLocation = async () => {
    let result = await initializeLocation(6);
    console.log("initializeLocation", result);
    setLocation(result?.location);
    setLocationError(result?.locationError);
  };

  try {
    useEffect(() => {
      //console.log("location", location);
      if (location === null) {
        if (
          props.route.params?.savedRegion === undefined ||
          props.route.params?.savedRegion === null
        ) {
          checkLocation();
        } else {
          setRegion(props.route.params?.savedRegion);
          console.log("savedRegion", props.route.params?.savedRegion);
        }
        if (initialRegion === null) {
          setInitialRegion(defaultRegion);
        }
        return;
      }

      try {
        if (
          location?.coords === undefined ||
          location?.coords?.latitude === undefined ||
          location?.coords?.longitude === undefined
        ) {
          setInitialRegion(defaultRegion);
        } else {
          setInitialRegion({
            latitude: checkIfCoordIsStringThenParse(location?.coords?.latitude),
            longitude: checkIfCoordIsStringThenParse(
              location?.coords?.longitude
            ),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      } catch (err) {
        console.error(err);
        sentryLog(err);
        setInitialRegion(defaultRegion);
      }

      if (region === null) {
        if (location?.coords !== undefined) {
          setRegion(location?.coords);
        }
      }
    }, [location]);

    useEffect(() => {
      if (locationError === undefined || locationError === null) {
        return;
      }

      setInitialRegion(defaultRegion);
      if (region === null) {
        setRegion(defaultRegion);
      }
      setText(locationError.toString());
    }, [locationError]);

    useEffect(() => {
      if (
        initialRegion === undefined ||
        initialRegion === null ||
        initialRegion?.latitude === undefined ||
        initialRegion?.longitude === undefined
      ) {
        return;
      }
      if (loading) {
        setLoading(false);
      }
      setMoving(false);
      console.log("initialRegion", initialRegion);
    }, [initialRegion]);

    useEffect(() => {
      const getLocaleNames = async () => {
        let locales = await getLocales(region);
        console.log("reverseGeocodeAsync", locales);
        if (
          locales === null ||
          locales?.length === undefined ||
          locales?.length < 1
        ) {
          //setText(JSON.stringify(region));
          setEligible(false);
          setLocale(null);
          setText(
            location === null &&
              locationError === null &&
              (props.route.params?.savedRegion === undefined ||
                props.route.params?.savedRegion === null)
              ? "Mendeteksi lokasi anda..."
              : "Lokasi tidak terbaca. Mohon pindahkan pin."
          );
          setAddressText(null);
          setRegionText(null);
        } else {
          if (!regionFromPlaces) {
            setAddressText(getAddressText(locales));
            setRegionText(
              `${locales[0]?.subregion}, ${locales[0]?.region} ${
                locales[0]?.postalCode ? locales[0]?.postalCode : ""
              }`
            );
          }

          if (locales[0]?.country === defaultcountry) {
            setLocale(locales[0]);
            setText(null);
            setEligible(true);
          } else {
            setLocale(null);
            setText("Lokasi berada di luar Indonesia");
            setEligible(false);
          }

          if (
            locationError !== null ||
            locales[0] === undefined ||
            locales[0] === null
          ) {
            setLocale(null);
            //console.log("locales number zero", locales[0]);
            return;
          }
        }
      };

      if (
        region === null ||
        region?.latitude === undefined ||
        region?.longitude === undefined
      ) {
        setEligible(false);
        setMoving(false);
        setText(
          location === null &&
            locationError === null &&
            (props.route.params?.savedRegion === undefined ||
              props.route.params?.savedRegion === null)
            ? "Mendeteksi lokasi anda..."
            : "Lokasi tidak terbaca. Mohon pindahkan pin."
        );
        setAddressText(null);
        setRegionText(null);
        /*if (Platform.OS === "android") {
          ToastAndroid.show(JSON.stringify(region), ToastAndroid.LONG);
        }*/
        return;
      }

      if (moving) {
        if (region === initialRegion) {
          setMoving(false);
        }
      } else {
        getLocaleNames();
      }
    }, [region]);

    useEffect(() => {
      console.log("locale", locale);
      //ToastAndroid.show(JSON.stringify(locale), ToastAndroid.LONG);
    }, [locale]);

    //debug
    useEffect(() => {
      //Platform.OS === "android" && ToastAndroid.show(JSON.stringify(kecamatan), ToastAndroid.LONG);
      console.log("kecamatanData", kecamatan);
    }, [kecamatan]);

    function onRegionChange(e) {
      //setRegion(e);
      if (regionFromPlaces) {
        setRegionFromPlaces(false);
      }
      if (
        initialRegion === null ||
        region === null ||
        initialRegion === region
      ) {
        setMoving(false);
      } else if (!moving) {
        setMoving(true);
      }
    }

    function onRegionChangeComplete(e) {
      setRegion(e);
      setMoving(false);
    }

    const pickPin = async () => {
      if (region === null || locale === null || !eligible) {
        navigation.navigate("Address", {
          addressData,
          isRealtime: false,
          isDefault,
          isNew,
        });
        return;
      }
      setAddressProcessing(true);
      const result = await processLocalesIntoAddressData(
        props,
        props.token,
        region?.latitude,
        region?.longitude,
        locale?.region,
        locale?.subregion,
        addressText,
        regionText,
        locale?.postalCode,
        kecamatan
      );
      let newAddressData = {
        ...addressData,
        ...result,
      };
      console.log("processLocalesIntoAddressData", newAddressData);
      setAddressProcessing(false);
      navigation.navigate("Address", {
        addressData: newAddressData,
        isRealtime: false,
        isDefault,
        isNew,
      });
    };

    function setRegionFromPlacesInput(data, detail) {
      /*console.log("placesData", data);
      console.log("placesDetail", detail);*/
      try {
        if (
          data === undefined ||
          data === null ||
          detail === undefined ||
          detail === null
        ) {
          return;
        }
        setPlacesInput(rbInput.current.getAddressText());

        let geometry = data?.geometry
          ? data?.geometry
          : detail?.geometry
          ? detail?.geometry
          : null;
        console.log("places geometry", geometry);
        if (
          geometry === null ||
          geometry?.location === undefined ||
          geometry?.location === null ||
          geometry?.location?.lat === undefined ||
          geometry?.location?.lng === undefined
        ) {
          return;
        }
        setRegionFromPlaces(true);
        setInitialRegion({
          latitude: checkIfCoordIsStringThenParse(geometry?.location?.lat),
          longitude: checkIfCoordIsStringThenParse(geometry?.location?.lng),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        let newAddressText = data?.description ? data?.description : null;
        if (newAddressText === null) {
          return;
        }

        if (
          data?.structured_formatting === undefined ||
          data?.structured_formatting === null
        ) {
          setAddressText(newAddressText);
          setRegionText(newAddressText);
        } else {
          setAddressText(
            data?.structured_formatting?.main_text
              ? data?.structured_formatting?.main_text
              : newAddressText
          );
          setRegionText(
            data?.structured_formatting?.secondary_text
              ? data?.structured_formatting?.secondary_text
              : newAddressText
          );
        }
        setKecamatan(getKecamatanFromPlacesData(data, detail));
      } catch (e) {
        console.error(e);
        sentryLog(e);
      }
    }

    function clearPlacesText() {
      setRegionFromPlacesInput(false);
      setPlacesInput("");
      rbInput.current.setAddressText("");
    }

    return (
      <SafeAreaView style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.daclen_orange} />
        ) : (
          <ReactMap
            location={location}
            moving={moving}
            initialRegion={initialRegion}
            regionFromPlaces={regionFromPlaces}
            onRegionChange={(e) => onRegionChange(e)}
            onRegionChangeComplete={(e) => onRegionChangeComplete(e)}
          />
        )}
        <View style={styles.containerTop}>
          <View style={styles.containerHorizontal}>
            <TouchableOpacity
              style={styles.containerBack}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons
                name="arrow-left-bold-circle"
                size={32}
                color={colors.daclen_light}
                style={{ alignSelf: "center" }}
              />
            </TouchableOpacity>
            <View style={styles.containerTextInput}>
              {Platform.OS === "web" ? null : (
                <GooglePlacesAutocomplete
                  ref={rbInput}
                  styles={{
                    textInput: styles.textInput,
                  }}
                  placeholder={mapplacesplaceholder}
                  query={{
                    key: googleAPIkey,
                    language: "id",
                    components: "country:ID",
                  }}
                  fetchDetails={true}
                  onPress={(data, detail) => {
                    setRegionFromPlacesInput(data, detail);
                  }}
                  onFail={(error) => {
                    console.error(error);
                    setText(error.toString());
                  }}
                />
              )}

              {(placesInput === null || placesInput === "") &&
              !regionFromPlaces ? null : (
                <TouchableOpacity
                  style={styles.close}
                  onPress={() => clearPlacesText()}
                >
                  <MaterialCommunityIcons
                    name="close"
                    color={
                      regionFromPlaces ? colors.daclen_blue : colors.daclen_gray
                    }
                    size={20}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {text === null ? null : (
            <Text allowFontScaling={false}
              style={[
                styles.text,
                {
                  backgroundColor:
                    locationError === null
                      ? eligible
                        ? colors.daclen_green
                        : colors.daclen_gray
                      : colors.daclen_danger,
                },
              ]}
            >
              {text}
            </Text>
          )}
        </View>

        {loading ? null : (
          <View style={styles.containerInfo}>
            <View style={styles.containerBottom}>
              <Text allowFontScaling={false} style={styles.textFullAddress}>
                {moving
                  ? "Pindahkan pin..."
                  : addressText
                  ? addressText
                  : "Lokasi tidak terdeteksi"}
              </Text>
              {moving ? (
                <ActivityIndicator
                  size="small"
                  color={colors.daclen_light}
                  style={styles.spinner}
                />
              ) : (
                <Text allowFontScaling={false} style={styles.textRegion}>
                  {regionText
                    ? regionText
                    : "Mohon pindahkan pin ke lokasi lain"}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => pickPin()}
              style={[
                styles.containerButton,
                {
                  backgroundColor:
                    moving || addressProcessing
                      ? colors.daclen_gray
                      : colors.daclen_blue,
                },
              ]}
              disabled={(moving || addressProcessing) && Platform.OS !== "web"}
            >
              {addressProcessing ? (
                <ActivityIndicator
                  size="small"
                  color={colors.daclen_light}
                  style={{ alignSelf: "center" }}
                />
              ) : (
                <MaterialCommunityIcons
                  name={
                    region === null || locale === null || !eligible
                      ? "pencil"
                      : "map-marker-check"
                  }
                  size={16}
                  color={colors.daclen_light}
                />
              )}

              <Text allowFontScaling={false} style={styles.textButton}>
                {region === null || locale === null || !eligible
                  ? "Isi Alamat Tanpa Titik"
                  : addressProcessing
                  ? "Memproses lokasi..."
                  : "Pilih Pin Lokasi"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  } catch (e) {
    console.error(e);
    sentryLog(e);
    return (
      <SafeAreaView style={styles.container}>
        <Text allowFontScaling={false} style={styles.text}>{e.toString()}</Text>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  containerTop: {
    position: "absolute",
    zIndex: 5,
    elevation: 6,
    top: 0,
    start: 0,
    width: "100%",
    backgroundColor: colors.daclen_black,
  },
  containerHorizontal: {
    flexDirection: "row",
    backgroundColor: "transparent",
    marginHorizontal: 10,
  },
  containerInfo: {
    position: "absolute",
    zIndex: 3,
    bottom: 0,
    start: 0,
    backgroundColor: "transparent",
    width: "100%",
  },
  containerBack: {
    width: 32,
    height: 32,
    backgroundColor: "transparent",
    marginVertical: 12,
    alignSelf: "flex-start",
  },
  containerTextInput: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.white,
    marginStart: 10,
    marginVertical: 4,
    alignSelf: "center",
    borderRadius: 6,
    alignItems: "center",
  },
  containerBottom: {
    borderRadius: 6,
    borderColor: colors.daclen_black_header,
    borderWidth: 1,
    elevation: 10,
    marginHorizontal: 10,
    backgroundColor: colors.daclen_black,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  containerButton: {
    marginHorizontal: 10,
    marginTop: 12,
    marginBottom: 20,
    borderRadius: 6,
    paddingVertical: 10,
    elevation: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Poppins", fontSize: 12,
    textAlign: "center",
    width: "100%",
    padding: 10,
    elevation: 4,
    color: colors.daclen_light,
  },
  textFullAddress: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    backgroundColor: "transparent",
    color: colors.daclen_light,
  },
  textRegion: {
    fontFamily: "Poppins", fontSize: 12,
    backgroundColor: "transparent",
    color: colors.daclen_light,
    marginTop: 6,
  },
  textButton: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: colors.daclen_light,
    marginStart: 10,
  },
  textInput: {
    flex: 1,
    color: colors.daclen_gray,
    backgroundColor: "transparent",
    paddingHorizontal: 10,
    paddingVertical: 2,
    fontFamily: "Poppins", fontSize: 12,
    marginTop: 2,
    alignSelf: "center",
  },
  close: {
    backgroundColor: "transparent",
    marginStart: 6,
    marginEnd: 10,
    alignSelf: "center",
  },
  spinner: {
    alignSelf: "center",
    marginTop: 10,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateReduxRajaOngkirWithKey,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(LocationPin);

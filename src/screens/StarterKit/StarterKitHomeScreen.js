import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  RefreshControl,
  Text,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import { getMediaKitKategoriThumbnail } from "../../axios/mediakit";
import { updateReduxMediaKitHome } from "../../utils/starterkit";
import EmptySpinner from "../../components/empty/EmptySpinner";
import AlertBox from "../../components/alert/AlertBox";
import StarterKitPhotoSegment from "../../components/starterkit/StarterKitPhotoSegment";
import Separator from "../../components/Separator";

const ratio = dimensions.fullWidthAdjusted / 430;

const StarterKitHomeScreen = (props) => {
  const { token, currentUser, home } = props;
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (home === null && token !== null) {
      fetchData();
      return;
    }
    if (refreshing) {
      setRefreshing(false);
    }
    //console.log("redux mediakit home", home);
  }, [home]);

  const fetchData = async () => {
    let result = await getMediaKitKategoriThumbnail(token);
    console.log("reult", result);
    if (
      result === undefined ||
      result === null ||
      result?.result === undefined ||
      result?.result === null
    ) {
      setError(
        result?.error ? result?.error : "Tidak bisa membuka Starter Kit.",
      );
    } else {
      props.updateReduxMediaKitHome(result?.result);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  function setActiveTab(e) {
    if (props?.setActiveTab === undefined || props?.setActiveTab === null) {
      return;
    }
    props?.setActiveTab(e);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh()}
          />
        }
      >
        {home === null ? (
          <EmptySpinner />
        ) : (
          <View style={styles.containerInside}>
            {home?.map((item, index) => (
              <View key={index} style={styles.containerItem}>
                <View style={styles.containerTitle}>
                  <Text allowFontScaling={false} style={styles.textTitle}>
                    {item?.title}
                  </Text>
                  <View style={styles.containerLine} />
                </View>
                {item?.items === undefined || item?.items?.length < 1
                  ? null
                  : item?.items.map((segment, i) => (
                      <StarterKitPhotoSegment
                        key={i}
                        {...segment}
                        unit={item?.unit}
                        openSegmentScreen={() => setActiveTab(segment?.title)}
                        isLast={false}
                      />
                    ))}
              </View>
            ))}
          </View>
        )}
        <View style={styles.containerBottom} />
      </ScrollView>
      <AlertBox text={error} onClose={() => setError(null)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    width: "100%",
  },
  containerInside: {
    backgroundColor: "transparent",
    minHeight: dimensions.fullHeight,
    paddingTop: staticDimensions.marginHorizontal,
  },
  containerItem: {
    backgroundColor: "transparent",
    marginBottom: staticDimensions.marginHorizontal,
  },
  containerTitle: {
    backgroundColor: "transparent",
    marginHorizontal: staticDimensions.marginHorizontal,
    marginBottom: 10 * ratio,
    flexDirection: "row",
    alignItems: "center",
  },
  containerLine: {
    flex: 1,
    backgroundColor: colors.black,
    height: 1,
  },
  containerBottom: {
    height: staticDimensions.pageBottomPadding,
    backgroundColor: "transparent",
  },
  textTitle: {
    fontFamily: "Poppins",
    color: colors.black,
    fontSize: 18 * ratio,
    marginEnd: staticDimensions.marginHorizontal / 2,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  home: store.mediaKitState.home,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      updateReduxMediaKitHome,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(StarterKitHomeScreen);

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { colors } from "../../styles/base";
import VideosFlatlist from "../../components/starterkit/VideosFlatlist";
import {
  getMediaKitPenjelasanBisnis,
  clearMediaKitVideosError,
  updateReduxMediaKitPenjelasanBisnis,
} from "../../axios/mediakit";
import { getObjectAsync, setObjectAsync } from "../../asyncstorage";
import { ASYNC_MEDIA_TUTORIAL_VIDEOS_KEY } from "../../asyncstorage/constants";
import CenteredView from "../../components/view/CenteredView";
import EmptySpinner from "../../components/empty/EmptySpinner";
import AlertBox from "../../components/alert/AlertBox";
import { penjelasanbisnistag } from "../../constants/dashboard";

const PenjelasanBisnisScreen = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { penjelasanBisnis, videoError, currentUser, token } = props;

  useEffect(() => {
    props.clearMediaKitVideosError();
  }, []);

  useEffect(() => {
    if (token === undefined || token === null || currentUser === null || currentUser?.id === undefined) {
      setError("Register / Login untuk melihat video Penjelasan Bisnis.");
      return;
    }
    if (penjelasanBisnis === null) {
      checkAsyncTutorial();
      return;
    }
    if (refreshing) {
      setRefreshing(false);
    }
    setObjectAsync(ASYNC_MEDIA_TUTORIAL_VIDEOS_KEY, penjelasanBisnis);
    console.log("redux penjelasanBisnis", penjelasanBisnis);
  }, [penjelasanBisnis]);

  useEffect(() => {
    setError(
      videoError === undefined || videoError === null || videoError === ""
        ? null
        : currentUser?.id === 8054
        ? videoError
        : "Refresh untuk mendapatkan video Penjelasan Bisnis."
    );
  }, [videoError]);

  const checkAsyncTutorial = async () => {
    const storageTutorial = await getObjectAsync(
      ASYNC_MEDIA_TUTORIAL_VIDEOS_KEY
    );
    if (
      storageTutorial === undefined ||
      storageTutorial === null ||
      storageTutorial?.length === undefined ||
      storageTutorial?.length < 1
    ) {
      props.getMediaKitPenjelasanBisnis(token);
    } else {
      if (refreshing) {
        setRefreshing(false);
      }
      props.updateReduxMediaKitPenjelasanBisnis(storageTutorial);
    }
  };

  const refreshPage = () => {
    setRefreshing(true);
    setError(null);
    props.clearMediaKitVideosError();
    props.getMediaKitPenjelasanBisnis(token);
  };

  return (
    <CenteredView title={penjelasanbisnistag} style={styles.container}>
      {(penjelasanBisnis === null || refreshing) && error === null ? (
        <EmptySpinner />
      ) : null}
      {penjelasanBisnis === null || refreshing ? null : (
        <View style={styles.containerInside}>
          {penjelasanBisnis?.length === undefined || penjelasanBisnis?.length < 1 ? (
            <Text allowFontScaling={false} style={styles.textUid}>
              Tidak ada Video Penjelasan Bisnis tersedia.
            </Text>
          ) : (
            <VideosFlatlist
              videos={penjelasanBisnis}
              refreshing={refreshing}
              refreshPage={() => refreshPage()}
              showTitle={true}
              title={penjelasanbisnistag}
              style={styles.containerFlatlist}
              userId={currentUser?.id}
              jenis_video={penjelasanbisnistag}
            />
          )}
        </View>
      )}
      <AlertBox text={error} onClose={() => setError(null)} />
    </CenteredView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    zIndex: 0,
    top: 0,
    start: 0,
    width: "100%",
    height: "100%",
  },
  containerError: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.daclen_danger,
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: 4,
  },
  containerInside: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    start: 0,
    zIndex: 2,
  },
  containerFlatlist: {
    flex: 1,
    width: "100%",
    paddingTop: 24,
    backgroundColor: "transparent",
  },
  containerOrientation: {
    position: "absolute",
    bottom: 6,
    end: 6,
    zIndex: 4,
    backgroundColor: colors.daclen_blue,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  textError: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: colors.white,
    marginHorizontal: 10,
    backgroundColor: "transparent",
    textAlign: "center",
    alignSelf: "center",
  },
  textUid: {
    backgroundColor: "transparent",
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: colors.daclen_light,
    margin: 20,
    textAlign: "center",
  },
  close: {
    alignSelf: "center",
    backgroundColor: "transparent",
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  penjelasanBisnis: store.mediaKitState.penjelasanBisnis,
  videoError: store.mediaKitState.videoError,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getMediaKitPenjelasanBisnis,
      updateReduxMediaKitPenjelasanBisnis,
      clearMediaKitVideosError,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(PenjelasanBisnisScreen);

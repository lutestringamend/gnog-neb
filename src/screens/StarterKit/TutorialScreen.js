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
  getTutorialVideos,
  clearMediaKitVideosError,
  updateReduxMediaKitVideosTutorial,
} from "../../axios/mediakit";
import { getObjectAsync, setObjectAsync } from "../../asyncstorage";
import { ASYNC_MEDIA_TUTORIAL_VIDEOS_KEY } from "../../asyncstorage/constants";
import { VIDEO_TUTORIAL_TITLE } from "../../constants/starterkit";
import CenteredView from "../../components/view/CenteredView";
import EmptySpinner from "../../components/empty/EmptySpinner";
import AlertBox from "../../components/alert/AlertBox";

const TutorialScreen = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { tutorials, videoError, currentUser, token } = props;

  useEffect(() => {
    props.clearMediaKitVideosError();
  }, []);

  useEffect(() => {
    if (token === undefined || token === null || currentUser === null || currentUser?.id === undefined) {
      setError("Register / Login untuk melihat video Tutorial.");
      return;
    }
    if (tutorials === null) {
      checkAsyncTutorial();
      return;
    }
    if (refreshing) {
      setRefreshing(false);
    }
    setObjectAsync(ASYNC_MEDIA_TUTORIAL_VIDEOS_KEY, tutorials);
    console.log("redux tutorials", tutorials);
  }, [tutorials]);

  useEffect(() => {
    setError(
      videoError === undefined || videoError === null || videoError === ""
        ? null
        : currentUser?.id === 8054
        ? videoError
        : "Refresh untuk mendapatkan video Tutorial."
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
      props.getTutorialVideos(token);
    } else {
      if (refreshing) {
        setRefreshing(false);
      }
      props.updateReduxMediaKitVideosTutorial(storageTutorial);
    }
  };

  const refreshPage = () => {
    setRefreshing(true);
    setError(null);
    props.clearMediaKitVideosError();
    props.getTutorialVideos(token);
  };

  return (
    <CenteredView title="Tutorial" style={styles.container}>
      {(tutorials === null || refreshing) && error === null ? (
        <EmptySpinner />
      ) : null}
      {tutorials === null || refreshing ? null : (
        <View style={styles.containerInside}>
          {tutorials?.length === undefined || tutorials?.length < 1 ? (
            <Text allowFontScaling={false} style={styles.textUid}>
              Tidak ada Video Tutorial tersedia.
            </Text>
          ) : (
            <VideosFlatlist
              videos={tutorials}
              refreshing={refreshing}
              refreshPage={() => refreshPage()}
              showTitle={true}
              title={VIDEO_TUTORIAL_TITLE}
              style={styles.containerFlatlist}
              userId={currentUser?.id}
              jenis_video="tutorial"
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
  tutorials: store.mediaKitState.tutorials,
  videoError: store.mediaKitState.videoError,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getTutorialVideos,
      updateReduxMediaKitVideosTutorial,
      clearMediaKitVideosError,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(TutorialScreen);

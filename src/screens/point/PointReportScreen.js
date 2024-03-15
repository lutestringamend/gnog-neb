import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { getLaporanPoin, clearAuthError } from "../../axios/user";
import { colors } from "../../styles/base";
import CenteredView from "../../components/view/CenteredView";
import EmptySpinner from "../../components/empty/EmptySpinner";
import EmptyPlaceholder from "../../components/empty/EmptyPlaceholder";
import AlertBox from "../../components/alert/AlertBox";
import { organizeListByTerakhirDiubah } from "../../utils/point";
import PointDayContainer from "../../components/point/PointDayContainer";

function PointReportScreen(props) {
  const { token, currentUser, points, hpv, authError } = props;
  const navigation = useNavigation();

  const [organizedList, setOrganizedList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  /*const [referralData, setReferralData] = useState([]);*/

  useEffect(() => {
    props.clearAuthError();
  }, []);

  useEffect(() => {
    if (currentUser?.id === undefined) {
      return;
    }
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    if (points === null) {
      return;
    }
    let organized = organizeListByTerakhirDiubah(points, true);
    console.log("organized", organized);
    setOrganizedList(organized);
    if (refreshing) {
      setRefreshing(false);
    }
    console.log("redux points", points?.length);
  }, [points]);

  useEffect(() => {
    if (authError === null) {
      if (error !== null) {
        setError(null);
      }
      return;
    }
    setError(authError);
    if (refreshing && points === null) {
      setRefreshing(false);
    }
  }, [authError]);

  /*useEffect(() => {
    if (hpv?.data?.children?.length !== undefined) {
      const data = [
        ...new Set(
          hpv?.data?.children
            .map(({ id, name }) => ({
              id,
              name,
            }))
            .flat(1),
        ),
      ];
      setReferralData(data);
      console.log("referralData", data);
    }
  }, [hpv]);*/

  const fetchData = () => {
    if (!(token === null || currentUser?.id === undefined)) {
      props.getLaporanPoin(currentUser?.id, token);
    }
  };

  function onRefresh() {
    setRefreshing(true);
    fetchData();
  }

  function openItem(item) {
    console.log(item);
  }

  return (
    <CenteredView style={styles.container} title="Riwayat Poin">
      <ScrollView
        style={styles.containerFlatlist}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh()}
          />
        }
      >
        {token === null || currentUser?.id === undefined ? (
          <EmptyPlaceholder
            title="Riwayat Poin"
            text="Anda harus login untuk melihat riwayat poin."
          />
        ) : points === null ? (
          <EmptySpinner />
        ) : points?.length < 1 || organizedList?.length < 1 ? (
          <EmptyPlaceholder
            title="Riwayat Poin"
            text="Anda belum memiliki riwayat poin."
          />
        ) : (
          organizedList.map((item, index) => (
            <PointDayContainer
              key={index}
              header={item?.date}
              isLast={index >= organizedList?.length - 1}
              list={item?.itemList}
              onPress={(e) => openItem(e)}
            />
          ))
        )}
      </ScrollView>
      <AlertBox text={error} onClose={() => setError(null)} />
    </CenteredView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.daclen_grey_light,
    width: "100%",
  },
  containerFlatlist: {
    backgroundColor: "transparent",
    flex: 1,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  currentUser: store.userState.currentUser,
  points: store.userState.points,
  hpv: store.userState.hpv,
  authError: store.userState.authError,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getLaporanPoin,
      clearAuthError,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(PointReportScreen);

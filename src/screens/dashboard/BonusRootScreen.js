import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Platform,
  ToastAndroid,
  Linking,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  getSyaratRoot,
  clearSyaratRoot,
  clearAuthError,
} from "../../axios/user";

import { colors, dimensions, staticDimensions } from "../../styles/base";
import {
  bonusfirstroot,
  bonusrootlevelcolors,
  bonussecondroot,
  hpvtitle,
  pvtitle,
  rpvtitle,
} from "../../constants/dashboard";
import BonusRootItem, {
  VerticalLine,
} from "../../components/bonusroot/BonusRootItem";
import { websyaratbonus } from "../../axios/constants";
import CenteredView from "../../components/view/CenteredView";
import EmptySpinner from "../../components/empty/EmptySpinner";
import Button from "../../components/Button/Button";
import EmptyPlaceholder from "../../components/empty/EmptyPlaceholder";

const ratio = dimensions.fullWidthAdjusted / 430;

function BonusRootScreen(props) {
  const { token, syaratRoot, authError } = props;
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const [rootTree, setRootTree] = useState([]);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    props.clearAuthError();
  }, []);

  useEffect(() => {
    if (
      (syaratRoot?.length === undefined || syaratRoot?.length < 1) &&
      token !== null
    ) {
      setLoading(true);
      props.getSyaratRoot(token);
    } else {
      setLoading(false);
      setActiveTab((activeTab) => (activeTab === null ? 0 : activeTab));
      //console.log("syaratRoot", syaratRoot);
    }
  }, [token, syaratRoot]);

  useEffect(() => {
    if (authError === null) {
      if (error !== null) {
        setError(null);
      }
      return;
    }
    setError(authError);
    if (
      loading &&
      (syaratRoot?.length === undefined || syaratRoot?.length < 1)
    ) {
      setLoading(false);
    }
  }, [authError]);

  useEffect(() => {
    if (error === null) {
      return;
    } else if (Platform.OS === "android") {
      ToastAndroid.show(error, ToastAndroid.SHORT);
    }
  }, [error]);

  useEffect(() => {
    if (activeTab === null) {
      return;
    } else if (
      syaratRoot[activeTab]?.rpv?.length === undefined ||
      syaratRoot[activeTab]?.rpv?.length < 1
    ) {
      console.log("empty rpv tree");
    } else {
      //console.log("rpv object", syaratRoot[activeTab]?.rpv);
      let data = [];
      for (let i = 0; i < syaratRoot[activeTab]?.rpv?.length; i++) {
        if (syaratRoot[activeTab]?.rpv[i]?.jumlah !== undefined) {
          let levelChildren = [];
          for (let j = 0; j < syaratRoot[activeTab]?.rpv[i]?.jumlah; j++) {
            levelChildren.push({ rpv: syaratRoot[activeTab]?.rpv[i]?.rpv });
          }
          data.push({
            key: syaratRoot[activeTab]?.rpv[i]?.level,
            levelChildren,
          });
        }
      }
      //console.log("data", data);
      setRootTree(data);
    }
  }, [activeTab]);

  function refreshPage() {
    setLoading(true);
    props.clearSyaratRoot();
  }

  function onOpenExternalLink() {
    Linking.openURL(websyaratbonus);
  }

  return (
    <CenteredView title="Syarat Bonus Root" style={styles.container}>
      {loading ? (
        <EmptySpinner />
      ) : token === null || activeTab === null ? (
        <EmptyPlaceholder
          title="Syarat Bonus Root"
          text="Anda harus Login dahulu untuk membaca Syarat Bonus Root"
        />
      ) : syaratRoot?.length === undefined || syaratRoot?.length < 1 ? (
        <EmptyPlaceholder
          title="Syarat Bonus Root"
          text="Mohon membuka website Daclen untuk membaca Syarat Bonus"
        />
      ) : (
        <ScrollView
          style={styles.containerFlatlist}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => refreshPage()}
            />
          }
        >
          <View style={styles.containerHeader}>
            <View style={styles.tabView}>
              <FlatList
                horizontal={true}
                data={syaratRoot}
                style={styles.containerFlatlist}
                renderItem={({ item, index }) => (
                  <Button
                    text={item?.level}
                    style={styles.containerTabItem}
                    onPress={() => setActiveTab(index)}
                  />
                )}
              />
            </View>
            <View style={styles.containerTable}>
              <Text allowFontScaling={false} style={styles.textTableHeader}>
                Syarat Bonus Root Level {syaratRoot[activeTab]?.level}
              </Text>
              <View style={[styles.containerSpec, { marginTop: 10 }]}>
                <Text allowFontScaling={false} style={styles.textSpecHeader}>
                  {pvtitle}
                </Text>
                <Text allowFontScaling={false} style={styles.textSpec}>
                  {syaratRoot[activeTab]?.pv}
                </Text>
              </View>

              <View style={styles.containerSpec}>
                <Text allowFontScaling={false} style={styles.textSpecHeader}>
                  {bonusfirstroot}
                </Text>
                <Text allowFontScaling={false} style={styles.textSpec}>
                  {`${
                    syaratRoot[activeTab]?.bonus_1
                      ? syaratRoot[activeTab]?.bonus_1
                      : "0"
                  }%`}
                </Text>
              </View>
              <View style={styles.containerSpec}>
                <Text allowFontScaling={false} style={styles.textSpecHeader}>
                  {bonussecondroot}
                </Text>
                <Text allowFontScaling={false} style={styles.textSpec}>
                  {`${
                    syaratRoot[activeTab]?.bonus_2
                      ? syaratRoot[activeTab]?.bonus_2
                      : "0"
                  }%`}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.containerMain}>
            <BonusRootItem
              isParent={true}
              title={hpvtitle}
              content={syaratRoot[activeTab]?.hpv}
              color={bonusrootlevelcolors[activeTab]}
              isLastItem={false}
              onPress={() => console.log(rootTree)}
            />
            <View style={styles.containerFlatlistTree}>
              {syaratRoot[activeTab]?.rpv?.length > 0 ? (
                <VerticalLine
                  style={{
                    height: 32,
                    marginStart: staticDimensions.marginHorizontal / 2,
                  }}
                />
              ) : null}
              {rootTree?.length === undefined || rootTree?.length < 1 ? (
                <EmptySpinner />
              ) : (
                rootTree.map((level) => (
                  <View key={level?.key} style={styles.containerRootChildren}>
                    <View style={styles.containerRootHeader}>
                      <VerticalLine
                        style={{
                          height:
                            level?.key >= rootTree?.length ? "52%" : "100%",
                        }}
                      />
                      <View style={styles.horizontalLine} />
                      <View style={styles.containerLevel}>
                        <Text
                          allowFontScaling={false}
                          style={styles.textRootHeader}
                        >
                          Level {level?.key}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.containerRootContent}>
                      <VerticalLine
                        style={{
                          height: "100%",
                          backgroundColor:
                            level?.key >= rootTree?.length
                              ? "transparent"
                              : colors.daclen_grey_container,
                        }}
                      />
                      <FlatList
                        numColumns={1}
                        horizontal={false}
                        style={styles.containerFlatlistChildren}
                        data={level?.levelChildren}
                        renderItem={({ item, index }) => (
                          <BonusRootItem
                            isParent={false}
                            title={rpvtitle}
                            content={item?.rpv}
                            isLastItem={
                              index >= level?.levelChildren?.length - 1
                            }
                            color={bonusrootlevelcolors[activeTab]}
                          />
                        )}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </CenteredView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: "100%",
  },
  containerFlatlist: {
    width: "100%",
    backgroundColor: "transparent",
  },
  containerHeader: {
    backgroundColor: colors.daclen_grey_light,
    paddingHorizontal: staticDimensions.marginHorizontal,
    paddingVertical: staticDimensions.marginHorizontal / 2,
  },
  containerMain: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: staticDimensions.pageBottomPadding,
    marginVertical: 20,
    marginHorizontal: staticDimensions.marginHorizontal,
  },
  containerRootChildren: {
    backgroundColor: "transparent",
    marginStart: staticDimensions.marginHorizontal / 2,
  },
  containerRootContent: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  containerFlatlistTree: {
    backgroundColor: "transparent",
    justifyContent: "flex-start",
  },
  containerFlatlistChildren: {
    backgroundColor: "transparent",
    marginHorizontal: 10,
    paddingBottom: 20,
  },
  containerTabItem: {
    paddingHorizontal: 20,
    marginEnd: 10,
  },
  containerRootHeader: {
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
  },
  containerTable: {
    width: dimensions.fullWidthAdjusted - 2 * staticDimensions.marginHorizontal,
    alignSelf: "center",
    borderRadius: 12 * ratio,
    backgroundColor: colors.white,
    marginVertical: staticDimensions.marginHorizontal,
    padding: staticDimensions.marginHorizontal / 2,
    minHeight: 150 * ratio,
    justifyContent: "space-between",
  },
  containerSpec: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  containerLevel: {
    backgroundColor: colors.daclen_grey_container,
    height: 40 * ratio,
    width: 180 * ratio,
    borderRadius: 12 * ratio,
    overflow: "hidden",
    justifyContent: "center",
    paddingHorizontal: 12 * ratio,
    elevation: 4,
  },
  tabView: {
    width: "100%",
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  horizontalLine: {
    width: 8,
    height: 4 * ratio,
    backgroundColor: colors.daclen_grey_container,
  },
  textTableHeader: {
    color: colors.black,
    fontSize: 18 * ratio,
    fontFamily: "Poppins-SemiBold",
  },
  textRootHeader: {
    fontSize: 14 * ratio,
    fontFamily: "Poppins-SemiBold",
    color: colors.black,
    backgroundColor: "transparent",
  },
  textSpecHeader: {
    backgroundColor: "transparent",
    fontFamily: "Poppins",
    fontSize: 12 * ratio,
    color: colors.black,
  },
  textSpec: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12 * ratio,
    backgroundColor: "transparent",
    color: colors.black,
  },
  textUid: {
    fontFamily: "Poppins",
    fontSize: 16,
    marginVertical: 20,
    textAlign: "center",
    padding: 10,
    color: colors.daclen_gray,
    marginHorizontal: 10,
  },
});

const mapStateToProps = (store) => ({
  token: store.userState.token,
  syaratRoot: store.userState.syaratRoot,
  authError: store.userState.authError,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getSyaratRoot,
      clearSyaratRoot,
      clearAuthError,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(BonusRootScreen);

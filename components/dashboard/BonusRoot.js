import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
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

import { colors, staticDimensions } from "../../styles/base";
import HistoryTabItem from "../history/HistoryTabItem";
import {
  bonusfirstroot,
  bonusrootlevelcolors,
  bonussecondroot,
  hpvtitle,
  pvtitle,
  rpvtitle,
} from "./constants";
import BonusRootItem, { VerticalLine } from "./BonusRootItem";
import { ErrorView } from "../webview/WebviewChild";
import { websyaratbonus } from "../../axios/constants";

function BonusRoot(props) {
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
    <SafeAreaView style={styles.container}>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_orange}
          style={{ alignSelf: "center", marginVertical: 20 }}
        />
      ) : token === null || activeTab === null ? (
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.textUid}>
            Anda harus Login / Register untuk membaca Syarat Bonus Root
          </Text>
        </TouchableOpacity>
      ) : syaratRoot?.length === undefined || syaratRoot?.length < 1 ? (
        <ErrorView
          error="Mohon membuka website Daclen untuk membaca Syarat Bonus"
          onOpenExternalLink={() => onOpenExternalLink()}
        />
      ) : (
        <View style={styles.container}>
          <View style={styles.tabView}>
            <FlatList
              horizontal={true}
              data={syaratRoot}
              style={styles.containerFlatlist}
              renderItem={({ item, index }) => (
                <HistoryTabItem
                  activeTab={activeTab}
                  name={index}
                  title={item?.level}
                  style={styles.containerTabItem}
                  backgroundColor={bonusrootlevelcolors[index]}
                  selectedColor={colors.daclen_blue}
                  marginEnd={10}
                  icon="account-multiple"
                  onPress={() => setActiveTab(index)}
                />
              )}
            />
          </View>
          <ScrollView
            style={styles.containerFlatlist}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => refreshPage()}
              />
            }
          >
            <View style={styles.containerTable}>
              <Text
                style={[
                  styles.textTableHeader,
                  { color: bonusrootlevelcolors[activeTab] },
                ]}
              >
                Syarat Bonus Root Level {syaratRoot[activeTab]?.level}
              </Text>
              <View style={styles.containerSpec}>
                <Text style={styles.textSpecHeader}>{pvtitle}</Text>
                <Text
                  style={[
                    styles.textSpec,
                    { color: bonusrootlevelcolors[activeTab] },
                  ]}
                >
                  {syaratRoot[activeTab]?.pv}
                </Text>
              </View>

              <View style={styles.containerSpec}>
                <Text style={styles.textSpecHeader}>{bonusfirstroot}</Text>
                <Text
                  style={[
                    styles.textSpec,
                    { color: bonusrootlevelcolors[activeTab] },
                  ]}
                >
                  {syaratRoot[activeTab]?.bonus_1
                    ? syaratRoot[activeTab]?.bonus_1
                    : "0"}
                  {" %"}
                </Text>
              </View>
              <View style={styles.containerSpec}>
                <Text style={styles.textSpecHeader}>{bonussecondroot}</Text>
                <Text
                  style={[
                    styles.textSpec,
                    { color: bonusrootlevelcolors[activeTab] },
                  ]}
                >
                  {syaratRoot[activeTab]?.bonus_2
                    ? syaratRoot[activeTab]?.bonus_2
                    : "0"}
                  {" %"}
                </Text>
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
                      backgroundColor: bonusrootlevelcolors[activeTab],
                    }}
                  />
                ) : null}
                {rootTree?.length === undefined || rootTree?.length < 1 ? (
                  <ActivityIndicator
                    size="large"
                    color={colors.daclen_gray}
                    style={{ alignSelf: "center", marginVertical: 20 }}
                  />
                ) : (
                  rootTree.map((level) => (
                    <View key={level?.key} style={styles.containerRootChildren}>
                      <View style={styles.containerRootHeader}>
                        <VerticalLine
                          style={{
                            height:
                              level?.key >= rootTree?.length ? "52%" : "100%",
                            backgroundColor: bonusrootlevelcolors[activeTab],
                          }}
                        />
                        <View
                          style={[
                            styles.horizontalLine,
                            {
                              backgroundColor: bonusrootlevelcolors[activeTab],
                            },
                          ]}
                        />
                        <Text
                          style={[
                            styles.textRootHeader,
                            {
                              backgroundColor: bonusrootlevelcolors[activeTab],
                            },
                          ]}
                        >
                          Level {level?.key}
                        </Text>
                      </View>
                      <View style={styles.containerRootContent}>
                        <VerticalLine
                          style={{
                            height: "100%",
                            backgroundColor:
                              level?.key >= rootTree?.length
                                ? "white"
                                : bonusrootlevelcolors[activeTab],
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
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
  },
  containerFlatlist: {
    width: "100%",
    backgroundColor: "transparent",
  },
  containerMain: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: staticDimensions.pageBottomPadding,
    marginVertical: 10,
    marginHorizontal: 12,
  },
  containerRootChildren: {
    backgroundColor: "white",
  },
  containerRootContent: {
    flexDirection: "row",
    backgroundColor: "white",
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
  },
  containerRootHeader: {
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
  },
  containerTable: {
    width: "90%",
    alignSelf: "center",
    borderRadius: 2,
    backgroundColor: "transparent",
    marginVertical: 20,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.daclen_gray,
  },
  containerSpec: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderColor: colors.daclen_gray,
    borderTopWidth: 1,
  },
  tabView: {
    width: "100%",
    backgroundColor: colors.daclen_light,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: colors.daclen_gray,
  },
  horizontalLine: {
    width: 8,
    height: 2,
    backgroundColor: colors.daclen_red,
  },
  textTableHeader: {
    width: "100%",
    backgroundColor: "transparent",
    textAlign: "center",
    fontSize: 16,
    padding: 10,
    fontWeight: "bold",
  },
  textRootHeader: {
    paddingVertical: 10,
    paddingHorizontal: 32,
    color: colors.daclen_light,
    borderTopStartRadius: 6,
    borderBottomEndRadius: 6,
    borderTopEndRadius: 6,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  textSpecHeader: {
    flex: 1,
    padding: 10,
    fontSize: 12,
    borderEndWidth: 1,
    backgroundColor: "transparent",
    borderColor: colors.daclen_gray,
    color: colors.daclen_graydark,
  },
  textSpec: {
    flex: 1,
    padding: 10,
    fontWeight: "bold",
    fontSize: 14,
    backgroundColor: "transparent",
    color: colors.daclen_black,
  },
  textUid: {
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
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(BonusRoot);

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { getSyaratRoot } from "../../axios/user";

import { colors, staticDimensions } from "../../styles/base";
import Separator from "../profile/Separator";
import HistoryTabItem from "../history/HistoryTabItem";
import {
  bonusrootlevelcolors,
  hpvtitle,
  rpvshort,
  rpvtitle,
} from "./constants";
import BonusRootItem, { VerticalLine } from "./BonusRootItem";

function BonusRoot(props) {
  const { token, syaratRoot } = props;
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [rootTree, setRootTree] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (
      (syaratRoot?.length === undefined || syaratRoot?.length < 1) &&
      token !== null
    ) {
      props.getSyaratRoot(token);
      setLoading(true);
    } else {
      setLoading(false);
      setActiveTab(0);
      console.log("syaratRoot", syaratRoot);
    }
  }, [token, syaratRoot]);

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

  useEffect(() => {
    console.log("rootTree", rootTree);
  }, [rootTree]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color={colors.daclen_orange}
          style={{ alignSelf: "center", marginVertical: 20 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {token ||
      activeTab === null ||
      syaratRoot?.length === undefined ||
      syaratRoot?.length < 1 ? (
        <ScrollView
          style={styles.containerFlatlist}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => refreshPage()}
            />
          }
        >
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
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.textUid}>
            Anda harus Login / Register untuk melihat syarat bonus root
          </Text>
        </TouchableOpacity>
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
    backgroundColor: "white",
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
    backgroundColor: "white",
    justifyContent: "flex-start",
  },
  containerFlatlistChildren: {
    backgroundColor: "white",
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
  tabView: {
    width: "100%",
    backgroundColor: colors.daclen_light,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  horizontalLine: {
    width: 8,
    height: 2,
    backgroundColor: colors.daclen_red,
  },
  textRootHeader: {
    width: "50%",
    padding: 10,
    color: colors.daclen_light,
    borderTopStartRadius: 6,
    borderBottomEndRadius: 6,
    borderTopEndRadius: 6,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getSyaratRoot,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(BonusRoot);

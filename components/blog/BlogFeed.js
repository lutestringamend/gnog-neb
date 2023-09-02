import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
//import { FlashList } from "@shopify/flash-list";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { getBlog } from "../../axios/blog";
import { finalblognumber, productpaginationnumber } from "../../axios/constants";
import MainHeader from "../main/MainHeader";
import BlogItem from "./BlogItem";
import { colors } from "../../styles/base";

function BlogFeed(props) {
  const { blogs, pageNumber } = props;
  const [loading, setLoading] = useState(false);
  const [onEndReachedCalledDuringMomentum, setEndReachedCalledDuringMomentum] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);

  useEffect(() => {
    if (blogs === null || blogs?.length === undefined) {
      loadData(true);
    } else {
      setLoading(false);
    }
    console.log("in redux", blogs?.length);
  }, [blogs]);

  useEffect(() => {
    if (paginationLoading && pageNumber > 1) {
      setPaginationLoading(false);
    }
    console.log("pageNumber", pageNumber);
  }, [pageNumber]);

  function loadData(isFirst) {
    if (loading || paginationLoading) return;
    if (isFirst) {
      setLoading(true);
      props.getBlog(1);
    } else if (pageNumber < finalblognumber) {
      props.getBlog(pageNumber + 1);
    }
  }

  function onEndReached() {
    if (!onEndReachedCalledDuringMomentum && !paginationLoading) {
      console.log("onEndReached");
      setPaginationLoading(true);
      setEndReachedCalledDuringMomentum(true);
      loadData(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader title="Blog" icon="arrow-left" />
      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_orange}
          style={{ alignSelf: "center", marginVertical: 20 }}
        />
      ) : blogs?.length > 0 ? (
        <View style={styles.containerFlatlist}>
          <FlatList
            initialNumToRender={productpaginationnumber}
            estimatedItemSize={productpaginationnumber}
            numColumns={1}
            horizontal={false}
            data={blogs}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => loadData(true)}
              />
            }
            onMomentumScrollBegin={() => setEndReachedCalledDuringMomentum(false)}
            onEndReachedThreshold={0.1}
            onEndReached={() => onEndReached()}
            renderItem={({ item }) => (
              <BlogItem
                id={item?.id}
                foto_url={item?.foto_url}
                created_at={item?.created_at}
                judul={item?.judul}
                isi_limit={item?.isi_limit}
                tag_blog={item?.tag_blog}
              />
            )}
          />
        </View>
      ) : (
        <Text style={styles.textUid}>Tidak ada blog tersedia</Text>
      )}
      {paginationLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.daclen_orange}
          style={styles.activityControl}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  containerFlatlist: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  activityControl: {
    alignSelf: "center",
    position: "absolute",
    bottom: 32,
    elevation: 10,
    zIndex: 20,
  },
});

const mapStateToProps = (store) => ({
  blogs: store.blogState.blogs,
  pageNumber: store.blogState.pageNumber,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getBlog,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(BlogFeed);

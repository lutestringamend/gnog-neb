import React, { useState, useEffect } from "react";
import {
  StyleSheet,
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { showBlog } from "../../axios/blog";
import BlogItem from "../../components/blog/BlogItem";
import { colors, dimensions } from "../../styles/base";
import CenteredView from "../../components/view/CenteredView";
import EmptySpinner from "../../components/empty/EmptySpinner";

function BlogScreen(props) {
  const { blogItems } = props;
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.route.params?.id === null) {
      setBlog({});
      setLoading(false);
      console.log("id is null");
    } else {
      const data = blogItems.find(({ id }) => id === props.route.params?.id);
      if (data === undefined) {
        setBlog({});
        setLoading(true);
        console.log("blogItem of this id is null");
        props.showBlog(props.route.params?.id);
      } else {
        setLoading(false);
        setBlog(data);
      }
    }
  }, [props.route.params?.id]);

  useEffect(() => {
    if (
      props.route.params?.id !== null &&
      props.route.params?.id !== undefined
    ) {
      if (loading) {
        const data = blogItems.find(({ id }) => id === props.route.params?.id);
        if (data === undefined) {
          console.log("blogItem of this id is still null");
          setBlog({});
        } else {
          setBlog(data);
        }
        setLoading(false);
      }
    }
  }, [blogItems]);

 
  return (
    <CenteredView title={blog?.judul ? blog?.judul : "Blog"} style={styles.container}>
      {loading ? (
       <EmptySpinner />
      ) : (
        <BlogItem
          id={blog?.id}
          foto_url={blog?.foto_url}
          created_at={blog?.created_at}
          judul={blog?.judul}
          isi_limit={blog?.isi_limit}
          isi={blog?.isi}
          tag_blog={blog?.tag_blog}
        />
      )}
    </CenteredView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
    justifyContent: "flex-start",
  },
});

const mapStateToProps = (store) => ({
  blogItems: store.blogState.blogItems,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      showBlog,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchProps)(BlogScreen);

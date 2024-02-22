import React, { useEffect } from "react";
import {
  StyleSheet,
} from "react-native";
import { FlashList } from "@shopify/flash-list";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { getFAQ } from "../../axios/profile";
import FAQChild from "../../components/profile/FAQChild";
import { staticDimensions } from "../../styles/base";
import CenteredView from "../../components/view/CenteredView";
import EmptySpinner from "../../components/empty/EmptySpinner";

function FAQScreen(props) {
  useEffect(() => {
    if (
      props.faq?.length < 1 ||
      props.faq === undefined ||
      props.faq === null
    ) {
      console.log("faq is null");
      props.getFAQ();
    } else {
      console.log(props.faq);
    }
  }, [props.faq]);

  return (
    <CenteredView title="Frequently Asked Questions" style={styles.container}>
      {props.faq?.length > 0 ? (
        <FlashList
          estimatedItemSize={10}
          numColumns={1}
          horizontal={false}
          data={props.faq}
          renderItem={({ item }) => (
            <FAQChild pertanyaan={item?.pertanyaan} jawaban={item?.jawaban} />
          )}
        />
      ) : (
        <EmptySpinner />
      )}
    </CenteredView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    paddingBottom: staticDimensions.pageBottomPadding,
  },
});

const mapStateToProps = (store) => ({
  faq: store.profileState.faq,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getFAQ,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(FAQScreen);

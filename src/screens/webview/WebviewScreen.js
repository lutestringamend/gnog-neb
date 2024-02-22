import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  getMediaKitHTML,
  getTncHTML,
  getPrivacyPolicy,
} from "../../../axios/profile";

import WebviewChild from "../../components/webview/WebviewChild";

function WebviewScreen(props, { navigation }) {
  const key = props.route.params?.webKey;
  const url = props.route.params?.url;

  useEffect(() => {
    if (key === undefined || key === null) {
      console.log("webKey is null");
      navigation.navigate("Main");
    } else {
      console.log(`webKey ${key} and title ${props.route.params?.text} and url ${url}`);

      switch (key) {
        case "mediakit":
          if (props.profileState?.mediakit === "") {
            props.getMediaKitHTML();
          }
          break;

        case "tnc":
          if (props.profileState?.tnc === "") {
            props.getTncHTML();
          }
          break;

        case "privacy":
          if (props.profileState?.privacy === "") {
            props.getPrivacyPolicy();
          }
          break;

        default:
          console.log("key unidentified");
          break;
      }
    }
  }, [key]);

  switch (key) {
    case "mediakit":
      return <WebviewChild content={props.profileState?.mediakit} title={props.route.params?.text} url={url} />;
    case "tnc":
      return <WebviewChild content={props.profileState?.tnc} title={props.route.params?.text}/>;
    case "privacy":
      return <WebviewChild content={props.profileState?.privacy} title={props.route.params?.text}/>;
    default:
      return null;
  }
}

const mapStateToProps = (store) => ({
  profileState: store.profileState.content,
  dashboard: store.historyState.dashboard,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      getMediaKitHTML,
      getTncHTML,
      getPrivacyPolicy,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(WebviewScreen);

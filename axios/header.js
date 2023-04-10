import { testtoken } from "./constants";

import { connect } from "react-redux";

function header(props) {
  let config = {
    headers: {
      Authorization: `Bearer ${props.token}`,
      Accept: "application/json",
    },
  };
  return props.token;
}

const mapStateToProps = (store) => ({
  token: store.userState.token,
});

export default connect(mapStateToProps, null)(header);

//export default config

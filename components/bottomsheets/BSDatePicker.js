import React, { memo } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import { colors } from "../../styles/base";
import { localisationID } from "../../axios/constants";
import { convertDateObjecttoDisplayLocaleDate } from "../../axios/profile";

const BSDatePicker = (props) => {
  /*const [dateValue, setDateValue] = useState(null);

  useEffect(() => {
    if (props?.currentDate === undefined || props?.currentDate === null) {
      return;
    }

    if (dateValue === null) {
      setDateValue(props?.currentDate ? props?.currentDate : new Date());
    } else {
      props?.closeThis();
    }
  }, [props?.currentDate]);*/

  const setDate = (event, date) => {
    const { type } = event;
    /*let log = `${type}\n${convertDateObjecttoDisplayLocaleDate(date)}`;
    if (Platform.OS === "android") {
      ToastAndroid.show(log, ToastAndroid.LONG);
    }*/

    if (
      props?.onPress === undefined ||
      props?.onPress === null ||
      props?.closeThis === undefined ||
      props?.closeThis === null ||
      date === undefined ||
      date === null
    ) {
      return;
    }

    if (type === "set") {
      props?.onPress(convertDateObjecttoDisplayLocaleDate(date));
    }
    props?.closeThis();
  };

  const sendError = (e) => {
    if (props?.onError === undefined || props?.onError === null) {
      return;
    }
    props?.onError(e);
  };

  /*if (dateValue === null) {
    return null;
  }*/

  return (
    <DateTimePicker
      mode="date"
      display="spinner"
      onChange={setDate}
      value={props?.currentDate ? props?.currentDate : new Date()}
      maximumDate={props?.maximumDate ? props?.maximumDate : null}
      minimumDate={props?.minimumDate ? props?.minimumDate : null}
      locale={localisationID}
      positiveButton={{ label: "Pilih", textColor: colors.daclen_blue }}
      negativeButton={{ label: "Batal", textColor: colors.daclen_gray }}
      onError={(e) => sendError(e)}
    />
  );
};

export default memo(BSDatePicker);

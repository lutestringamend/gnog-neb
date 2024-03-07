import { monthNames } from "../axios/constants";

export const organizeListByCreatedAt = (list, isISOString) => {
  let result = [];
  try {
    for (let i = 0; i < list?.length; i++) {
      if (list[i]?.created_at) {
        let header = isISOString
          ? convertISOStringtoDateDisplay(list[i]?.created_at)
          : convertDDMMYYYtoDateDisplay(list[i]?.created_at);
        let timestamp = isISOString
          ? convertISOStringtoUnixTime(list[i]?.created_at)
          : convertDDMMYYYtoUnixTime(list[i]?.created_at);
        if (result?.length === undefined || result?.length < 1) {
          let item = {
            date: header,
            timestamp,
            itemList: [list[i]],
          };
          result.push(item);
        } else {
          const found = result.find(({ date }) => date === header);
          if (found === undefined || found === null) {
            let item = {
              date: header,
              timestamp,
              itemList: [list[i]],
            };
            result.push(item);
          } else {
            let itemList = found?.itemList ? found?.itemList : [];
            itemList.push(list[i]);
            let item = {
              date: header,
              timestamp,
              itemList,
            };
            let newResult = [];
            newResult.push(item);
            for (let j = 0; j < result?.length; j++) {
              if (result[j]?.timestamp !== timestamp) {
                newResult.push(result[j]);
              }
            }
            result = newResult;
          }
        }
      }
    }
    result.sort((a, b) => b?.timestamp - a?.timestamp);
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const convertISOStringtoDateDisplay = (string) => {
  let result = "";
  try {
    const date = new Date(string);
    result = `${date.getDate()} ${
      monthNames[date.getMonth()]
    } ${date.getFullYear()}`;
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const convertISOStringtoUnixTime = (string) => {
  let result = "";
  try {
    const date = new Date(string);
    date.setHours(0, 0, 0, 0);
    result = date.getTime();
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const convertDDMMYYYtoDateDisplay = (date, isReverse) => {
  let result = "";
  try {
    const items = date.split("-");
    if (isReverse) {
      result = `${parseInt(items[2])} ${monthNames[parseInt(items[1]) - 1]} ${
        items[0]
      }`;
    } else {
      result = `${parseInt(items[0])} ${monthNames[parseInt(items[1]) - 1]} ${
        items[2]
      }`;
    }
  } catch (e) {
    console.error(e);
  }
  return result;
};

export const convertDDMMYYYtoUnixTime = (date) => {
  let result = "";
  try {
    const items = date.split("-");
    let dateObj = new Date();
    dateObj.setFullYear(
      parseInt(items[2]),
      parseInt(items[1]) - 1,
      parseInt(items[0]),
    );
    dateObj.setHours(0, 0, 0, 0);
    result = dateObj.getTime();
  } catch (e) {
    console.error(e);
  }
  return result;
};

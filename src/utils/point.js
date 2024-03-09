import { convertDDMMYYYtoDateDisplay, convertDDMMYYYtoUnixTime, convertISOStringtoDateDisplay, convertISOStringtoUnixTime } from "./history";

export const organizeListByTerakhirDiubah = (list, isISOString) => {
    let result = [];
    try {
      for (let i = 0; i < list?.length; i++) {
        if (list[i]?.terakhir_diubah) {
          let header = isISOString
            ? convertISOStringtoDateDisplay(list[i]?.terakhir_diubah)
            : convertDDMMYYYtoDateDisplay(list[i]?.terakhir_diubah);
          let timestamp = isISOString
            ? convertISOStringtoUnixTime(list[i]?.terakhir_diubah)
            : convertDDMMYYYtoUnixTime(list[i]?.terakhir_diubah);
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
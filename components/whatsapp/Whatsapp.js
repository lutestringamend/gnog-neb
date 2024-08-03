import { Linking, Platform } from "react-native";

export const openWhatsapp = (no, template, forceNoTrim) => {
  let url = Platform.OS === "web" ? `https://api.whatsapp.com/send?text=${template}` : `whatsapp://send?text=${template}`;
  let number = no;

  if (!(number === null || number === undefined)) {
    try {
      if (forceNoTrim === undefined || forceNoTrim === null || !forceNoTrim) {
        number = number.trim();
        if (number.substring(0, 1) === "0") {
          number = `62${number.substring(1, number?.length)}`;
        }
        number = number.replaceAll("+", "");
        number = number.replaceAll(" ", "");
        number = number.replaceAll("-", "");
      }
      url = Platform.OS === "web" ? `https://wa.me/${number}${template ? `?text=${template}` : ""}` : `whatsapp://send${template ? `?text=${template}` : ""}&phone=${number}`;
    } catch (e) {
      console.error(e);
    }
  }
    console.log(`open Whatsapp ${url}`);
    Linking.openURL(url).catch((e) => {
      console.error(e);
      Linking.openURL(`https://wa.me/${number}${template ? `?text=${template}` : ""}`);
    });
  };
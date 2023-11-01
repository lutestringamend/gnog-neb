import { Linking } from "react-native";

export const openWhatsapp = (number, template) => {
    let url = `https://wa.me/${number}${template ? `?text=${template}` : ""}`;
    if (number === null || number === undefined) {
      url = `https://api.whatsapp.com/send?text=${template}`;
    }
    console.log(`open Whatsapp ${url}`);
    Linking.openURL(url);
  };
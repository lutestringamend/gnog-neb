import Axios from "axios";
import Axioss from "../index";
//import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { sharingOptionsInvoicePDF } from "../../components/media/constants";
import { sentryLog } from "../../sentry";
import { getInvoiceFileName } from "../cart";
import { getpdffiles } from "../constants";

export const getPDFFiles = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  const response = await Axioss.get(getpdffiles, config)
    .catch((error) => {
      console.error(error);
      return null;
    });

  const data = response?.data ? response?.data?.data ? response?.data?.data : null : null;
  console.log("getPDFFiles with header");
  return data;
}

export const createInvoicePDF = async (html, invoice_no) => {
  let session = null;
  let error = null;

  try {
    console.log("createInvoicePDF", html);
    const result = await Print.printToFileAsync({
      html,
      width: 595,
      height: 842,
      orientation: Print.Orientation.portrait,
    });
    console.log("print result", result);
    if (result?.uri) {
      await shareAsync(result?.uri, sharingOptionsInvoicePDF);
      session = "success"
    } 
  } catch (e) {
    console.error(e);
    sentryLog(e);
    error = e.toString();
  } 

  

  /*
const blob = new Blob([data], {
      type: 'application/pdf'
    });
    console.log("blob", blob);

    const fr = new FileReader();
    console.log("documentDirectory", FileSystem.documentDirectory);
    fr.onload = async () => {
      try {
        const fileUri = `${FileSystem.documentDirectory}/${getInvoiceFileName(invoice_no)}`;
        await FileSystem.writeAsStringAsync(fileUri, fr.result.split(',')[1], { encoding: FileSystem.EncodingType.Base64 });
        shareAsync(fileUri, sharingOptionsPDF);
        session = "success";
      } catch (err) {
        console.error(err);
        error = err.toString();
      }
    };
   
    fr.readAsDataURL(blob);
  */
  

  /*try {
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    
    if (permissions?.granted !== true || permissions?.directoryUri === null || permissions?.directoryUri === "") {
      return {
        session,
        error: "Anda tidak memberikan izin untuk mengakses penyimpanan",
      }
    }
    console.log("directoryUri", permissions?.directoryUri);
    const base64 = await FileSystem.readAsStringAsync(data, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    
    const safUri = await FileSystem.StorageAccessFramework.createFileAsync(
      permissions?.directoryUri,
      `${invoice_no}.pdf`,
      "application/pdf"
    ).catch((e) => {
      console.error(e);
      setDownloadUri(null);
      setSuccess(false);
      if (e?.code === "ERR_FILESYSTEM_CANNOT_CREATE_FILE") {
        error =
          "Tidak bisa menyimpan file di folder sistem. Mohon pilih folder lain.";
      } else {
        error =
          base64.substring(0, 64) +
          "\ncreateFileAsync catch\n" +
          e.toString();
      }
    });
    const fileWriting = await FileSystem.writeAsStringAsync(safUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    }).catch((e) => {
      console.error(e);
      error = "\nwriteAsStringAsync catch\n" + e.toString();
    });

    const fileSharing = await shareAsync(safUri, sharingOptionsPDF);
    session = "success";
  } catch (err) {
    console.error(err);
    error = err.toString();
  }*/
  return {
    session,
    error,
  };
};

export function downloadPDF(url) {
  const config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
      "Access-Control-Allow-Headers": "application/json,content-type",
      "Access-Control-Allow-Credentials": true,
      "Content-Type": "text/plain",
    },
    responseType: "blob",
    withCredentials: false,
  };

  console.log("GET " + url + " with config " + JSON.stringify(config));

  Axios.get(url, config)
    .then((res) => {
      console.log(typeof res.data);
      const file = new Blob([res.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      console.log(fileURL);
      return fileURL;
    })
    .catch((error) => {
      console.log(error);
    });

  /*return (dispatch) => {
        
      };*/
}

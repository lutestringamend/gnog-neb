import Axios from "axios";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import { sharingOptionsPDF } from "../../components/media/constants";

export const createInvoicePDF = async (data, invoice_no) => {
  let session = null;
  let error = null;

  try {
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (permissions.granted) {
      const base64 = await FileSystem.readAsStringAsync(data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const safUri = await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
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
    } else {
      error = "Anda tidak memberikan izin untuk mengakses penyimpanan";
    }
  } catch (err) {
    console.error(err);
    error = err.toString();
  }
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

import Axios from "axios";

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

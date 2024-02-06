import { Platform } from "react-native";
import { TEMP_DEV_DEVICE_TOKEN, getauthshowotp, postauthrequestotp, postauthverifikasiotp, userregister } from "../../axios/constants";
import { getAuthDeviceInfo } from "../../axios/user";
import { sentryLog } from "../../sentry";
import Axioss from "./index";
import { getObjectAsync } from "../../components/asyncstorage";
import { ASYNC_DEVICE_TOKEN_KEY } from "../../components/asyncstorage/constants";

export const postAuthRegister = async (authData) => {
    try {
        const deviceToken = await getObjectAsync(ASYNC_DEVICE_TOKEN_KEY);
        const params = getAuthDeviceInfo(
            {
              ...authData,
              device_name: Platform.OS,
            },
            deviceToken ? deviceToken : TEMP_DEV_DEVICE_TOKEN,
          );

          console.log("postAuthRegister");
        const result = await Axioss.post(userregister, params)
        .catch((error) => {
          console.error(error);
          //sentryLog(error);
          return {
            result: null,
            error: error.toString(),
          }
        });

        return {
            result: result?.data,
            error: null,
        }
    } catch (e) {
        console.error(e);
        return {
            result: null,
            error: e.toString()
        }
    } 
    
}

export const getAuthShowOTP = async (otp_id) => {
    try {

          const url = `${getauthshowotp}/${otp_id}`
          console.log("getAuthShowOTP", url); 
          const response = await Axioss.get(url)
            .catch((error) => {
              console.log(error);
              return {
                result: null,
                error: error.toString(),
              }
            });
        return {
            result: response?.data,
            error: null,
        }       
    } catch (e) {
        console.error(e);
        return {
            result: null,
            error: e.toString()
        }
    } 
}

export const postVerifikasiAuthOTP = async (otp_id, otp) => {
    try {
          const params = {
            otp,
          };
          const url = `${postauthverifikasiotp}/${otp_id}`
          console.log("postVerifikasiAuthOTP", url, params); 
          const response = await Axioss.post(url, params)
            .catch((error) => {
              console.log(error);
              return {
                result: null,
                error: error.toString(),
              }
            });
        return {
            result: response?.data,
            error: null,
        }       
    } catch (e) {
        console.error(e);
        return {
            result: null,
            error: e.toString()
        }
    } 
}

export const postRequestAuthOTP = async (nomor_telp, referral) => {
    try {
          const params = {
            nomor_telp,
            referral,
          };
      
          console.log("postRequestAuthOTP", postauthrequestotp, params); 
          const response = await Axioss.post(postauthrequestotp, params)
            .catch((error) => {
              console.log(error);
              return {
                result: null,
                error: error.toString(),
              }
            });
        return {
            result: response?.data,
            error: null,
        }       
    } catch (e) {
        console.error(e);
        return {
            result: null,
            error: e.toString()
        }
    } 
}
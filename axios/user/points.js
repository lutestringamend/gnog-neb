import { sentryLog } from "../../sentry";
import { getpenukaranpoindates, getpenukaranpoinindexproduk } from "../constants";
import Axioss from "../index";
import Axios from "axios";

export const getPenukaranPoinIndexProduk = async (token) => {
    let result = null;
    let error = null;
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      };

    try {
        const response = await Axioss.get(getpenukaranpoinindexproduk, config)
            .catch((err) => {
                console.log(err);
                error = err.toString();
            });
        result = response?.data ? response?.data?.data ? response?.data?.data : null : null;
        //console.log("getPenukaranPoinDates response", response);
    } catch (e) {
        sentryLog(e);
        console.error(e);
        error = e.toString();
    }
    return {
        result,
        error
    };
}

export const getPenukaranPoinDates = async () => {
    let result = null;
    let error = null;

    try {
        const response = await Axioss.get(getpenukaranpoindates)
            .catch((err) => {
                console.log(err);
                error = err.toString();
            });
        result = response?.data ? response?.data?.data ? response?.data?.data : null : null;
        //console.log("getPenukaranPoinDates response", response);
    } catch (e) {
        sentryLog(e);
        console.error(e);
        error = e.toString();
    }
    return {
        result,
        error
    };
}
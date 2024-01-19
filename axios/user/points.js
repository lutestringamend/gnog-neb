import { sentryLog } from "../../sentry";
import { getpenukaranpoin, getpenukaranpoindates, getpenukaranpoinindexproduk, getpenukaranpoinkeranjang, postpenukaranpoinkeranjang, postpenukaranpoinstore } from "../constants";
import Axioss from "../index";

export const postPenukaranPoinStore = async (token, keranjang_poin_id) => {
    let result = null;
    let error = null;
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      };
      const params = {
        keranjang_poin_id,
      };

    console.log("postPenukaranPoinStore", params);

    try {
        const response = await Axioss.get(postpenukaranpoinstore, params, config)
            .catch((err) => {
                console.log(err);
                error = err.toString();
            });
        result = response?.data ? response?.data?.data ? response?.data?.data : null : null;
        console.log("postPenukaranPoinStore response", response);
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

export const postPenukaranPoinKeranjang = async (token, produk) => {
    let result = null;
    let error = null;
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      };
      const params = {
        produk,
      };

    console.log("postPenukaranPoinKeranjang", params);

    try {
        const response = await Axioss.get(postpenukaranpoinkeranjang, params, config)
            .catch((err) => {
                console.log(err);
                error = err.toString();
            });
        result = response?.data ? response?.data?.data ? response?.data?.data : null : null;
        //console.log("postPenukaranPoinKeranjang response", response);
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

export const getPenukaranPoinKeranjang = async (token) => {
    let result = null;
    let error = null;
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      };

    try {
        const response = await Axioss.get(getpenukaranpoinkeranjang, config)
            .catch((err) => {
                console.log(err);
                error = err.toString();
            });
        result = response?.data ? response?.data?.data ? response?.data?.data : null : null;
        console.log("getPenukaranPoinKeranjang response", response?.data?.data);
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

export const getPenukaranPoin = async (token) => {
    let result = null;
    let error = null;
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      };

    try {
        const response = await Axioss.get(getpenukaranpoin, config)
            .catch((err) => {
                console.log(err);
                error = err.toString();
            });
        result = response?.data ? response?.data?.data ? response?.data?.data : null : null;
        console.log("getPenukaranPoin response", response?.data?.data);
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
        console.log("getPenukaranPoinDates response", response?.data?.data);
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
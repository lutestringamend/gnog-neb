const error = {
  message: "Request failed with status code 500",
  name: "AxiosError",
  stack:
    "AxiosError: Request failed with status code 500\n    at settle (http://192.168.1.246:8081/node_modules/expo/AppEntry.bundle//&platform=android&dev=true&minify=false&app=com.daclen.android&modulesOnly=false&runModule=true:159738:37)\n    at onloadend (http://192.168.1.246:8081/node_modules/expo/AppEntry.bundle//&platform=android&dev=true&minify=false&app=com.daclen.android&modulesOnly=false&runModule=true:159634:29)\n    at call (native)\n    at dispatchEvent (http://192.168.1.246:8081/node_modules/expo/AppEntry.bundle//&platform=android&dev=true&minify=false&app=com.daclen.android&modulesOnly=false&runModule=true:31747:31)\n    at setReadyState (http://192.168.1.246:8081/node_modules/expo/AppEntry.bundle//&platform=android&dev=true&minify=false&app=com.daclen.android&modulesOnly=false&runModule=true:30377:29)\n    at __didCompleteResponse (http://192.168.1.246:8081/node_modules/expo/AppEntry.bundle//&platform=android&dev=true&minify=false&app=com.daclen.android&modulesOnly=false&runModule=true:30179:29)\n    at apply (native)\n    at anonymous (http://192.168.1.246:8081/node_modules/expo/AppEntry.bundle//&platform=android&dev=true&minify=false&app=com.daclen.android&modulesOnly=false&runModule=true:30304:52)\n    at apply (native)\n    at emit (http://192.168.1.246:8081/node_modules/expo/AppEntry.bundle//&platform=android&dev=true&minify=false&app=com.daclen.android&modulesOnly=false&runModule=true:2292:40)\n    at apply (native)\n    at __callFunction (http://192.168.1.246:8081/node_modules/expo/AppEntry.bundle//&platform=android&dev=true&minify=false&app=com.daclen.android&modulesOnly=false&runModule=true:2826:36)\n    at anonymous (http://192.168.1.246:8081/node_modules/expo/AppEntry.bundle//&platform=android&dev=true&minify=false&app=com.daclen.android&modulesOnly=false&runModule=true:2587:31)\n    at __guard (http://192.168.1.246:8081/node_modules/expo/AppEntry.bundle//&platform=android&dev=true&minify=false&app=com.daclen.android&modulesOnly=false&runModule=true:2777:15)\n    at callFunctionReturnFlushedQueue (http://192.168.1.246:8081/node_modules/expo/AppEntry.bundle//&platform=android&dev=true&minify=false&app=com.daclen.android&modulesOnly=false&runModule=true:2586:21)",
  config: {
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false,
    },
    adapter: "xhr",
    transformRequest: [null],
    transformResponse: [null],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {},
    headers: {
      Accept: "application/json",
      Authorization: "Bearer 29007|vECRHPCMknphzgbkhvXrhzU7hSOh5GxGFxN30yt3",
    },
    baseURL: "https://daclen.com/",
    method: "get",
    url: "api/mobile/user/current",
  },
  code: "ERR_BAD_RESPONSE",
  status: 500,
};

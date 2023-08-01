import Axios from 'axios'
import { mainhttp } from './constants'

const instance = Axios.create({
    baseURL: mainhttp,
});

export const checkNumberEmpty = (e) => {
    if (e === undefined || e === null) {
        return 0;
    }
    try {
        if (isNaN(e)) {
            return parseInt(e);
        } else {
            return e;
        }
    } catch (e) {
        console.error(e);
        return 0;
    }
}

export default instance;
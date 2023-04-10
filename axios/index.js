import Axios from 'axios'
import { mainhttp } from './constants'

const instance = Axios.create({
    baseURL: mainhttp,
});

export default instance;
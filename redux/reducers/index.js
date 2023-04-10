import { combineReducers } from "redux"
import { user } from './user'
import { product } from "./product"
import { history } from "./history"
import { blog } from "./blog"
import { home } from "./home"
import { profile } from './profile'
import { media } from "./media"

const Reducers = combineReducers({
    userState: user,
    productState: product,
    historyState: history,
    homeState: home,
    blogState: blog,
    profileState: profile,
    mediaState: media,
})

export default Reducers

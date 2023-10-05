import { combineReducers } from "redux"
import { user } from './user'
import { product } from "./product"
import { notifications } from "./notifications"
import { history } from "./history"
import { blog } from "./blog"
import { home } from "./home"
import { profile } from './profile'
import { media } from "./media"
import { mediakit } from "./mediakit"

const Reducers = combineReducers({
    userState: user,
    productState: product,
    historyState: history,
    notificationsState: notifications,
    homeState: home,
    blogState: blog,
    profileState: profile,
    mediaState: media,
    mediaKitState: mediakit,
})

export default Reducers

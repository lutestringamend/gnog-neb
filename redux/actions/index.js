import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { 
    USER_STATE_CHANGE, 
    USER_POSTS_STATE_CHANGE, 
    USER_FOLLOWING_STATE_CHANGE, 
    USERS_DATA_STATE_CHANGE,
    USERS_POSTS_STATE_CHANGE,
    USERS_LIKES_STATE_CHANGE,
    USERS_LIKES_COUNT_STATE_CHANGE,
    CLEAR_DATA
} from '../constants/index'

export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

export function fetchUser(){
    return((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists) {
                    //console.log("user snapshot data: " + JSON.stringify(snapshot.data()));
                    dispatch({type: USER_STATE_CHANGE, currentUser: snapshot.data()})
                } else {
                    console.log("user does not exist")
                }
            })
            .catch((error) => {
                console.log(error)
            })
    })
}

export function fetchUserPosts(){
    return((dispatch) => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .orderBy("creation", "desc")
            .onSnapshot((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                //console.log(posts);
                dispatch({ type : USER_POSTS_STATE_CHANGE, posts })
            })
    })
}

export function fetchUserFollowing(){
    return((dispatch) => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .onSnapshot((snapshot) => {
                let following = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id
                })
                dispatch({ type : USER_FOLLOWING_STATE_CHANGE, following });
                for(let i = 0; i < following.length; i++) {
                    dispatch(fetchUsersData(following[i], true));
                }
            })
            
    })
}

export function fetchUsersData(uid, getPosts) {
    return((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);
        if (!found) {
            firebase.firestore()
                .collection("users")
                .doc(uid)
                .get()
                .then((snapshot) => {
                    if(snapshot.exists) {
                        let user = snapshot.data();
                        user.uid = snapshot.id;
                        dispatch({type: USERS_DATA_STATE_CHANGE, user});

                        if (getPosts) {
                            dispatch(fetchUsersFollowingPosts(user.uid));
                        } else {
                            //console.log(`fetching JUST user data for ${user.uid}`);
                            //console.log(user);
                        }

                    } else {
                        console.log("user does not exist")
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    })
}

export function fetchUsersFollowingPosts(uid){
    return((dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "desc")
            .get()
            .then((snapshot) => {
                //console.log(snapshot);
                //const uid = snapshot.query.EP.path.segments[1];
                const uid = snapshot._delegate.query._query.path.segments[1];
                //console.log({ snapshot, uid });

                const user = getState().usersState.users.find(el => el.uid === uid);

                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data, user }
                })
  
                /*console.log(`dispatching posts for uid ${uid}`);
                console.log(posts);*/
                for (let i=0; i < posts.length; i++) {
                    dispatch(fetchUsersFollowingLikesCount(uid, posts[i].id));
                    //dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
                }
                dispatch({ type : USERS_POSTS_STATE_CHANGE, posts });
                //console.log(`after dispatching for uid ${uid}, getState is`);
                //console.log(getState());
            })
            .catch((error) => {
                console.log(`fetchUsersFollowingPosts error ${error}`);
            })
    })
}

export function fetchUsersFollowingLikes(uid, postId){
    return((dispatch) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot((snapshot) => {
                //const postId = snapshot._delegate.query._query.path.segments[1];
                let currentUserLike = false;
                if(snapshot.exists) {
                    currentUserLike = true;
                }
                console.log(`fetchUsersFollowingLikes for ${postId} is ${currentUserLike}`);
                dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike})
                
            })
            
    })
}

export function fetchUsersFollowingLikesCount(uid, postId){
    return((dispatch) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .onSnapshot((snapshot) => {
                let likes = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id
                })
                const likesCount = likes.length;
                console.log(`${postId} has ${likesCount} likes`);
                dispatch({ type: USERS_LIKES_COUNT_STATE_CHANGE, postId, likesCount});

                if (likes.length > 0) {
                    console.log(likes);
                    dispatch(fetchUsersFollowingLikes(uid, postId))
                }
                                
            })
            
    })
}
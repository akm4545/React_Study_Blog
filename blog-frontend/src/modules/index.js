import { combineReducers } from "redux";
import auth,{authSaga} from "./auth";
import loading from './loading';
import {all} from 'redux-saga/effects';
import user, {userSaga} from "./user";
import write, {writeSaga} from './write';
import post, {postSaga} from './post';
import posts, {postsSaga} from "./posts";

//모든 context 취합
const rootReducer = combineReducers({
    auth,
    loading,
    user,
    write,
    post,
    posts,
});

//루트 사가
export function* rootSaga(){
    yield all([authSaga(), userSaga(), writeSaga(), postSaga(), postsSaga()]);
}

export default rootReducer;
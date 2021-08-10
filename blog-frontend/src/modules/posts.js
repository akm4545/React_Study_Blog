import { createAction, handleActions } from "redux-actions";
import createRequestSaga, {createRequestActionTypes} from "../lib/createRequestSage";
import * as postsAPI from '../lib/api/posts';
import {takeLatest} from 'redux-saga/effects';

//미리 액션 타입을 만드는 함수르 만들어 얻어온다
const [
    LIST_POSTS,
    LIST_POSTS_SUCCESS,
    LIST_POSTS_FAILURE,
] = createRequestActionTypes('posts/LIST_POSTS');

//액션 생성 함수 LIST_POSTS액션을 생성하며 payload로 받는 값 명시
export const listPosts = createAction(
    LIST_POSTS,
    ({tag, username, page}) => ({tag, username, page}),
);

//api 요청 함수를 얻어옴
const listPostsSaga = createRequestSaga(LIST_POSTS, postsAPI.listPosts);

//액션 발생시 요청 (마지막 요청만 처리)
export function* postsSaga(){
    yield takeLatest(LIST_POSTS, listPostsSaga);
}

//전역 state 초기값
const initialState = {
    posts: null,
    error: null,
    lastPage: 1,
};

//액션 발생에 의한 전역 state 변화
const posts = handleActions(
    {
        //기존 state 형태를 유지하고 게시글만 바꾼다 (payload를 posts로 명명)
        [LIST_POSTS_SUCCESS]: (state, {payload: posts, meta: response}) => ({
            ...state,
            posts,
            lastPage: parseInt(response.headers['last-page'], 10), //문자열을 숫자로 변환
        }),
        [LIST_POSTS_FAILURE]: (state, {payload: error}) => ({
            ...state,
            error,
        }),
    },
    initialState,
);

export default posts;
import { createAction, handleActions } from "redux-actions";
import createRequestSaga, {createRequestActionTypes} from "../lib/createRequestSage";
import * as postsAPI from '../lib/api/posts';
import {takeLatest} from 'redux-saga/effects';

//액션 정의
const [
    READ_POST,
    READ_POST_SUCCESS,
    READ_POST_FAILURE,
] = createRequestActionTypes('post/READ_POST');

const UNLOAD_POST = 'post/UNLOAD_POST'; //포스트 페이지에서 벗어날 때 데이터 비우기

//액션 생성 함수
export const readPost = createAction(READ_POST, id => id);
export const unloadPost = createAction(UNLOAD_POST);

//api 요청 사가 형식의 메서드 반환
const readPostSaga = createRequestSaga(READ_POST, postsAPI.readPost);

//api 요청
export function* postSaga(){
    yield takeLatest(READ_POST, readPostSaga);
}

//초기값
const initialState = {
    post: null,
    error: null,
};

//전역 state 변경
const post = handleActions(
    {
        [READ_POST_SUCCESS]: (state, {payload: post}) => ({
            ...state,
            post,
        }),
        [READ_POST_FAILURE]: (state, {payload: error}) => ({
            ...state,
            error,
        }),
        //페이지를 벗어날때 리덕스 비우기
        [UNLOAD_POST]: () => initialState,
    },
    initialState,
);

export default post;


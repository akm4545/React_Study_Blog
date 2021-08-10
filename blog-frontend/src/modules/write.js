import { createAction, handleActions } from "redux-actions";
import createRequestSaga, {createRequestActionTypes} from "../lib/createRequestSage";
import * as postsAPI from '../lib/api/posts';
import {takeLatest} from 'redux-saga/effects';

const INITIALIZE = 'write/INITIALIZE'; //모든 내용 초기화
const CHANGE_FIELD = 'write/CHANGE_FIELD'; //특정 key값 바꾸기
const SET_ORIGINAL_POST = 'write/SET_ORIGINAL_POST';
//저번에 작성했던 액션 타입 생성 함수로 한꺼번에 생성
const [
    WRITE_POST,
    WRITE_POST_SUCCESS,
    WRITE_POST_FAILURE,
] = createRequestActionTypes('write/WRITE_POST'); //포스트 작성

const [
    UPDATE_POST,
    UPDATE_POST_SUCCESS,
    UPDATE_POST_FAILURE,
] = createRequestActionTypes('write/UPDATE_POST'); //포스트 수정

//액션 생성 함수
export const initialize = createAction(INITIALIZE);
export const setOriginalPost = createAction(SET_ORIGINAL_POST, post => post);

//payload 값이 어떤게 들어가는지 명시
export const changeField = createAction(CHANGE_FIELD, ({key, value}) => ({
    key,
    value,
}));

//글쓰기 액션 생성 함수
export const writePost = createAction(WRITE_POST, ({title, body, tags}) => ({
    title,
    body,
    tags,
}));

//수정 액션 생성 합수
export const updatePost = createAction(
    UPDATE_POST,
    ({id, title, body, tags}) => ({
        id,
        title,
        body,
        tags,
    })
)

//사가 생성 미리 생성해둔 비동기 통신 사가 이용 함수 반환
const writePostSaga = createRequestSaga(WRITE_POST, postsAPI.writePost);
const updatePostSage = createRequestSaga(UPDATE_POST, postsAPI.updatePost);

//액션 감지하여 사가 실행 (중복 발생해도 마지막건만 실행)
export function* writeSaga() {
    yield takeLatest(WRITE_POST, writePostSaga);
    yield takeLatest(UPDATE_POST, updatePostSage);
}

//초기값 (형태잡기)
const initialState = {
    title: '',
    body: '',
    tags: [],
    post: null,
    postError: null,
    originalPostId: null,
};

//액션 발생시 변경 (state)
const write = handleActions(
    {
        [INITIALIZE]: state => initialState, //initialState를 넣으면 초기 상태로 바뀜
        [CHANGE_FIELD]: (state, {payload: {key, value}}) => ({
            ...state,
            [key]: value, //특정 key 값을 업데이트
        }),
        //포스트 작성 state를 불러와 재구성
        [WRITE_POST]: state => ({
            ...state,
            //post와 postError를 초기화
            post: null,
            postError: null,
        }),
        //포스트 작성 성공 첫번째 인수는 현재 상태, 두번째는 새로운 액션 객체
        //즉 기존 상태를 복사하고 전달받은 액션 객체에서 payload를 post라는 이름을 붙여 복사해 넣는다
        [WRITE_POST_SUCCESS]: (state, {payload: post}) => ({
            ...state,
            post,
        }),
        //포스트 작성 실패
        [WRITE_POST_FAILURE]: (state, {payload: postError}) => ({
            ...state,
            postError,
        }),
        //글쓰기시 전의 정보를 리덕스에 저장
        [SET_ORIGINAL_POST]: (state, {payload: post}) => ({
            ...state,
            title: post.title,
            body: post.body,
            tags: post.tags,
            originalPostId: post._id,
        }),
        [UPDATE_POST_SUCCESS]: (state, {payload: post}) => ({
            ...state,
            post,
        }),
        [UPDATE_POST_FAILURE]: (state, {payload: postError}) => ({
            ...state,
            postError,
        }),
    },
    initialState,
);

export default write;
import { createAction, handleActions } from "redux-actions";
import {takeLatest, call} from 'redux-saga/effects';
import * as authAPI from '../lib/api/auth';
import createRequestSaga, {createRequestActionTypes} from "../lib/createRequestSage";

const TEMP_SET_USER = 'user/TEMP_SET_USER'; //새로고침 이후 임시 로그인 처리
//회원 정보 확인
//함수로 유저 체크에 대한 액션 여러개를 만든다
const [CHECK, CHECK_SUCCESS, CHECK_FAILURE] = createRequestActionTypes(
    'user/CHECK',
);
const LOGOUT = 'user/LOGOUT';

//액션 생성 함수
export const tempSetUser = createAction(TEMP_SET_USER, user => user);
export const check = createAction(CHECK);
export const logout = createAction(LOGOUT);

//비동기 통신을 하기 위한 사가를 만든다
const checkSaga = createRequestSaga(CHECK, authAPI.check);

function checkFailureSaga(){
    try{
        localStorage.removeItem('user'); //localStorage에서 user를 제거
    }catch(e){
        console.log('localStorage is not working');
    }
}

function* logoutSaga(){
    try{
        yield call(authAPI.logout); //logout API 호출
        localStorage.removeItem("user"); //localStorage에서 user를 제거
    }catch(e){
        console.log(e);
    }
}

//CHECK액션을 보고있다가 마지막 액션 발생시에만 비동기 통신을 실행한다
export function* userSaga(){
    yield takeLatest(CHECK, checkSaga);
    yield takeLatest(CHECK_FAILURE, checkFailureSaga);
    yield takeLatest(LOGOUT, logoutSaga);
}

//전역변수로 관리할 객체의 형태를 만들고 초기화한다
const initialState = {
    user: null,
    checkError: null,
};

//액션 발생에 따라 전역변수를 업데이트 한다
export default handleActions(
    {
        [TEMP_SET_USER]: (state, {payload: user}) => ({
            ...state,
            user,
        }),
        //체크 성공시 전역 state에 user정보를 담는다
        [CHECK_SUCCESS]: (state, {payload: user}) => ({
            ...state,
            user,
            checkError: null,
        }),
        [CHECK_FAILURE]: (state, {payload: error}) => ({
            ...state,
            user: null,
            checkError: error,
        }),
        [LOGOUT]: state => ({
            ...state,
            user: null,
        }),
    },
    initialState,
);



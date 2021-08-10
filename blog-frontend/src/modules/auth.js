import { createAction, handleActions } from "redux-actions";
import produce from 'immer';
import {takeLatest} from 'redux-saga/effects';
import createRequestSaga ,{ createRequestActionTypes } from "../lib/createRequestSage";
import * as authAPI from '../lib/api/auth';

//액션
const CHANGE_FIELD = 'auth/CHANGE_FIELD';
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM';

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILUER] = createRequestActionTypes( 
    'auth/REGISTER',
);

const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes(
    'auth/LOGIN',
);

//액션 생성 함수
// 액션과 페이로드
export const changeField = createAction(
    CHANGE_FIELD,
    ({form, key, value}) => ({
        form, // register, login
        key, // username, password, passwordConfirm
        value, //실제 바꾸려는 값
    }),
);
export const initializeForm = createAction(INITIALIZE_FORM, form => form); //register /login
export const register = createAction(REGISTER, ({username, password}) => ({
    username,
    password,
}));

export const login = createAction(LOGIN, ({username, password}) => ({
    username,
    password,
}));

//사가 생성
const registerSage = createRequestSaga(REGISTER, authAPI.register);
const loginSaga = createRequestSaga(LOGIN, authAPI.login);

export function* authSaga(){
    yield takeLatest(REGISTER, registerSage);
    yield takeLatest(LOGIN, loginSaga);
}

//초기 상태
const initialState = {
    register: {
        username: '',
        password: '',
        passwordConfirm: '',
    },
    login: {
        username: '',
        password: '', 
    },
    auth: null,
    authError: null,
};

//액션 발생시 변화 현재 코드는 액션 발생시 이전 상태를 저장
const auth = handleActions(
    {
        [CHANGE_FIELD]: (state, {payload : {form, key, value}}) =>
            produce(state, draft => {
                draft[form][key] = value; //예: state.register.username을 바꾼다
            }),
        [INITIALIZE_FORM]: (state, {payload: form}) => ({
            ...state,
            [form]: initialState[form],
            authError: null, //폼 전환 시 회원 인증 에러 초기화
        }),
        //회원가입 성공
        //payload를 auth로 부르겠다
        [REGISTER_SUCCESS]: (state, {payload: auth}) => ({
            ...state,
            authError: null,
            auth,
        }),
        //회원가입 실패
        [REGISTER_FAILUER]: (state, {payload: error}) => ({
            ...state,
            authError: error,
        }),
        //로그인 성공
        [LOGIN_SUCCESS]: (state, {payload: auth}) => ({
            ...state,
            authError: null,
            auth,
        }),
        //로그인 실패
        [LOGIN_FAILURE]: (state, {payload: error}) => ({
            ...state,
            authError: error,
       }),
    },
    initialState,
);

export default auth;
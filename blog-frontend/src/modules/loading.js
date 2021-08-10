import { createAction, handleActions } from "redux-actions";

const START_LOADING = 'loading/START_LOADING';
const FINISH_LOADING = 'loading/FINISH_LOADING';

/*
    요청을 위한 액션 타입을 payload로 설정 (예: "sample/GET_POST")
*/

//액션 생성 함수
//액션 외에는 자동으로 payload로 들어가지만 어떤것이 들어가야 하는지 알아보기 쉽게 하기 위해 에로우 펑션으로 작성
export const startLoading = createAction(
    START_LOADING,
    requestType => requestType,
);

export const finishLoading = createAction(
    FINISH_LOADING,
    requestType => requestType,
);

//초기값
const initialState = {};

//액션에 따른 contextState 업데이트
//action.payload로 가져오는 이유는 requestType이 고정값이 아니기 때문
const loading = handleActions(
    {
        [START_LOADING]: (state, action) => ({
            ...state,
            [action.payload]: true,
        }),
        [FINISH_LOADING]: (state, action) => ({
            ...state,
            [action.payload]: false,
        }),
    },
    initialState,
);

export default loading;
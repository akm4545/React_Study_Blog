import React, {useEffect, useCallback} from "react";
import Editor from "../../components/write/Editor";
import { useSelector, useDispatch } from "react-redux";
import { changeField, initialize } from "../../modules/write";

const EditorContainer = () => {
    //액션 발생 함수 할당
    const dispatch = useDispatch();

    //전역 state에서 (write) title과 body 불러와 객체로 만든다
    const {title, body} = useSelector(({write}) => ({
        title: write.title,
        body: write.body,
    }));
    
    //함수 리렌더링 방지 payload를 받아 액션 생성
    const onChangeField = useCallback(payload => dispatch(changeField(payload)),[
        dispatch,
    ]);

    //언마운트될 때 초기화 함수형 생명주기
    useEffect(() => {
        return () => {
            dispatch(initialize());
        };
    }, [dispatch]);

    return <Editor onChangeField={onChangeField} title={title} body={body}/>;
};

export default EditorContainer;
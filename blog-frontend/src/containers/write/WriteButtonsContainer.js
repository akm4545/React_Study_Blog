import React, {useEffect} from "react";
import WriteActionButtons from "../../components/write/WriteActionButtons";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import {writePost, updatePost} from '../../modules/write';

//history를 사용할 것이므로
const WriteActionButtonsContainer = ({history}) => {
    //액션 생성함수 장착
    const dispatch = useDispatch();
    
    //write모듈에 있는 전역 state 불러오기
    const {title, body, tags, post, postError, originalPostId} = useSelector(({write}) => ({
        title: write.title,
        body: write.body,
        tags: write.tags,
        post: write.post,
        postError: write.postError,
        originalPostId: write.originalPostId,
    }));

    //포스트 등록
    //전역 state를 바꾸는 함수이므로 container에 
    const onPublish = () => {
        if(originalPostId){
            dispatch(updatePost({title, body, tags, id: originalPostId}));
            return;
        }
        dispatch(
            writePost({
                title,
                body,
                tags,
            }),
        );
    };

    //취소 
    const onCancel = () => {
        history.goBack();
    }

    //성공 혹은 실패 시 할 작업
    //post와 postError을 보고있다
    //글을 작성하면 성공,실패 여부에 따라 위 state값이 변하므로 Effect실행 
    useEffect(() => {
        if(post){
            const {_id, user} = post;
            history.push(`/@${user.username}/${_id}`);
        }
        if(postError){
            console.log(postError);
        }
    }, [history, post, postError]);
    
    return (
        <WriteActionButtons 
            onPublish={onPublish} 
            onCancel={onCancel} 
            isEdit={!!originalPostId}
        />);
};

//history 사용 선언
export default withRouter(WriteActionButtonsContainer);
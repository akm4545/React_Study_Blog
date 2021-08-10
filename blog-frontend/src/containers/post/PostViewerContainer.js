import React,{useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router";
import { readPost, unloadPost } from "../../modules/post";
import PostViewer from "../../components/post/PostViewer";
import PostActionButtons from "../../components/post/PostActionButtonsBlock";
import { setOriginalPost } from "../../modules/write";
import { removePost } from "../../lib/api/posts";

const PostViewerContainer = ({match, history}) => {
    //처음 마운트 될 때 포스트 읽기 API 요청
    //파람 읽어오기 match
    const {postId} = match.params;
    
    //액션 생성 함수
    const dispatch = useDispatch();

    //전역 state 불러오기
    //요청을 하면 전역 state의 loading 객체가 변하므로 로딩 상태를 읽어온다
    const {post ,error, loading, user} = useSelector(({post, loading, user}) => ({
        post: post.post,
        error: post.error,
        loading: loading['post/READ_POST'],
        user: user.user,
    }));

    useEffect(() => {
        //액션 발생 넘어온 postId를 넘겨준다 즉 게시글 읽기
        dispatch(readPost(postId));

        //언마운트될 때 리덕스에서 포스트 데이터 없애기
        return () => {
            dispatch(unloadPost());
        };
    }, [dispatch, postId]);

    //수정 액션
    const onEdit = () => {
        dispatch(setOriginalPost(post));
        history.push('/write');
    };

    //삭제
    const onRemove = async () => {
        try{
            await removePost(postId);
            history.push('/'); //홈으로 이동
        } catch(e){
            console.log(e);
        }
    }

    //자기 글인지 확인 유저 정보와 포스트의 유저 정보를 비교한다
    const ownPost = (user && user._id) === (post && post.user._id);

    //자기 글이면 수정버튼 보임 + 액션 방생시키고 글쓰기 창으로 이동
    return <PostViewer 
                post={post} 
                loading={loading} 
                error={error} 
                actionButtons={ownPost && <PostActionButtons onEdit={onEdit} onRemove={onRemove}/>}
            />;
};

export default withRouter(PostViewerContainer);


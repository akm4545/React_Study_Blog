import React, {useEffect} from "react";
import qs from 'qs';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import PostList from '../../components/posts/PostList';
import { listPosts } from "../../modules/posts";

//전역 state와 component를 연결
const PostListContainer = ({location, match}) => {
    //액션 생성 함수
    const dispatch = useDispatch();

    //리덕스 상태 조회
    const {posts, error, loading, user} = useSelector(
        //state에서 추출 비구조화 문법
        ({posts, loading, user}) => ({
            //posts리덕스 state에서 추출
            posts: posts.posts,
            error: posts.error,
            loading: loading['posts/LIST_POSTS'],
            //user리덕스 state에서 추출
            user: user.user,
        }),
    );
    
    //함수형에서 생명주기 관리
    useEffect(() => {
        //location.search 쿼리 스트링 받아오기
        const {tag, username, page} = qs.parse(location.search, {
            ignoreQueryPrefix: true,
        });
        dispatch(listPosts({tag, username, page}));
    }, [dispatch, location.search]);

    return (
        <PostList
            loadgin={loading}
            error={error}
            posts={posts}
            showWriteButton={user}
        />
    );
};

export default withRouter(PostListContainer);
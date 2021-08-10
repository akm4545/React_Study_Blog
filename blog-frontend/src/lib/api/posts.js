import qs from 'qs';
import client from "./client";

export const writePost = ({title, body, tags}) => 
    client.post('/api/posts', {title, body, tags});

export const readPost = id => client.get(`/api/posts/${id}`);

//게시글 목록
export const listPosts = ({page, username, tag}) => {
    const queryString = qs.stringify({
        page,
        username,
        tag,
    });
    return client.get(`/api/posts?${queryString}`);
}

//게시글 수정
export const updatePost = ({id, title, body, tags}) => 
    client.patch(`/api/posts/${id}`, {
        title,
        body,
        tags,
    });

//게시글 삭제
export const removePost = id => client.delete(`/api/posts/${id}`);
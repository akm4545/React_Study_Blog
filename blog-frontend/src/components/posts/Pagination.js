import React from "react";
import styled from 'styled-components';
import qs from 'qs';
import Button from '../common/Button';

const PaginationBlock = styled.div`
    width: 320px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    margin-bottom: 3rem;
`;

const PageNumber = styled.div``;

const buildLink = ({username, tag, page}) => {
    // 쿼리 생성
    const query = qs.stringify({tag, page});

    //유저 네임이 있을때 없을때 
    return username ? `/@${username}?${query}` : `/?${query}`
}

const Pagination = ({page, lastPage, username, tag}) => {
    return (
        <PaginationBlock>
            {/* 1페이지면 사용 불가, 1이면 링크 생성 안함 */}
            <Button
                disabled={page === 1}
                to={
                    page === 1 ? undefined : buildLink({username, tag, page: page - 1})
                }
            >
                이전
            </Button>
            <PageNumber>{page}</PageNumber>
            <Button
                disabled={page === lastPage}
                to={
                    page === lastPage
                        ? undefined
                        : buildLink({username, tag, page: page + 1})
                }
            >
                다음
            </Button>
        </PaginationBlock>
    );
};

export default Pagination;
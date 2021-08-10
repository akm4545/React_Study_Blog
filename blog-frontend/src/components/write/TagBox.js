import React, {useState, useCallback} from "react";
import { useEffect } from "react";
import styled from "styled-components";
import palette from '../../lib/styles/palette';

const TagBoxBlock = styled.div`
    width: 100%;
    border-top: 1px solid ${palette.gray[2]};
    padding-top: 2rem;

    h4{
        color: ${palette.gray[8]};
        margin-top: 0;
        margin-bottom: 0%.5rem;
    }
`;

const TagForm = styled.form`
    overflow: hidden;
    display: flex;
    width: 256px;
    border: 1px solid ${palette.gray[9]}; /* 스타일 초기화 */
    input,
    button {
        outline: none;
        border: none;
        font-size: 1rem;
    }

    input {
        padding: 0.5rem;
        flex: 1;
        min-width: 0;
    }

    button {
        cursor: pointer;
        padding-right: 1rem;
        padding-left: 1rem;
        border: none;
        background: ${palette.gray[8]};
        color: white;
        font-weight: bold;
        &:hover {
            background: ${palette.gray[6]};
        }
    }
`;

const Tag = styled.div`
    margin-right: 0.5rem;
    color: ${palette.gray[6]};
    cursor: pointer;
    &:hover {
        opacity: 0.5;
    }
`;

const TagListBlock = styled.div`
    display: flex;
    margin-top: 0.5rem;
`;

//React.memo를 사용하여 tag값이 바뀔 때만 리렌더링되도록 처리
const TagItem = React.memo(({tag, onRemove}) => (
    <Tag onClick={() => onRemove(tag)}>#{tag}</Tag>
));

//React.memo를 사용하여 tag값이 바뀔 때만 리렌더링되도록 처리
const TagList = React.memo(({tags, onRemove}) => (
    <TagListBlock>
        {tags.map(tag => (
            <TagItem key={tag} tag={tag} onRemove={onRemove}/>
        ))}
    </TagListBlock>
));

//컴포넌트를 하나에서 처리해도 되지만 나눈 이유는 렌더링 최적화
//만약 나누지 않았다면 input 값이 바뀔때마다 모두 리렌더링 될것이다
const TagBox = ({tags, onChangeTags}) => {
    //스테이트 선언
    const [input, setInput] = useState('');
    const [localTags, setLocalTags] = useState([]);

    //useCallback = 함수 리렌더링 방지 localTags가 바뀌면 렌더링 
    //태그 추가
    const insertTag = useCallback(
        tag => {
            if (!tag) return; //공백이라면 추가하지 않음
            if (localTags.includes(tag)) return; //이미 존재한다면 추가하지 않음
            //넥스트 태그스에 기존 state로 사용하는 태그와 입력받은 tag를 추가로 넣는다
            const nextTags = [...localTags, tag];
            //이걸 하는 이유가 뭔지 나중에 삭제해서 비교해보기
            setLocalTags(nextTags);
            //전역 state에도 추가한다 
            onChangeTags(nextTags);
        },
        [localTags, onChangeTags],
    );

    //태그 삭제
    const onRemove = useCallback(
        tag => {
            const nextTags = localTags.filter(t => t !== tag);
            setLocalTags(nextTags);
            onChangeTags(nextTags);
        },
        [localTags, onChangeTags],
    );
    
    //태그 임시 저장
    const onChange = useCallback(e => {
        setInput(e.target.value);
    }, []);

    //태그 서브밋 (완전 추가)
    const onSubmit = useCallback(
        e => {
            e.preventDefault();
            insertTag(input.trim()); //앞뒤 공백을 없앤 후 등록
            setInput(''); //input 초기화
        },
        [input, insertTag],
    );

    //tag 값이 바뀔 때 
    useEffect(() => {
        setLocalTags(tags);
    }, [tags]);
    
    //input 태그에 타자를 칠 시 onChange이벤트로 등록하여 임시 저장
    //클릭시 onRemove props 가 tagItem에 까지 전달되어 클릭 이벤트로 등록 삭제
    //submit 시 이벤트를 중지하고 태그 추가
    return (
        <TagBoxBlock>
            <h4>태그</h4>
            <TagForm onSubmit={onSubmit}>
                <input 
                    placeholder="태그를 입력하세요" 
                    value={input}
                    onChange={onChange}
                />
                <button type="submit">추가</button>
            </TagForm>
            <TagList tags={localTags} onRemove={onRemove}/>
        </TagBoxBlock>
    );
};

export default TagBox;
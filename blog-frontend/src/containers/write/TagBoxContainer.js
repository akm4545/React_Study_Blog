import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TagBox from "../../components/write/TagBox";
import { changeField } from "../../modules/write";

const TagBoxContainer = () => {
    //액션 생성 함수 할당
    const dispatch = useDispatch();
    //전역 state값 가져오기
    const tags = useSelector(state => state.write.tags);
    
    //전역 state값을 변경하는 액션 세팅
    const onChangeTags = nextTags => {
        dispatch(
            changeField({
                key: 'tags',
                value: nextTags,
            }),
        );
    };

    return <TagBox onChangeTags={onChangeTags} tags={tags} />;
};

export default TagBoxContainer;
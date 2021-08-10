import React from "react";
import TagBoxContainer from "../containers/write/TagBoxContainer";
import Responsive from "../components/common/Responsive";
import WriteButtonsContainer from "../containers/write/WriteButtonsContainer";
import EditorContainer from "../containers/write/EditorContainer";
import { Helmet } from "react-helmet-async";

const WritePage = () => {
    return (
        <Responsive>
            <Helmet>
                <title>글 작성하기 - REACTERS</title>    
            </Helmet>
            <EditorContainer />
            <TagBoxContainer/>
            <WriteButtonsContainer/>
        </Responsive>
    )
};

export default WritePage;
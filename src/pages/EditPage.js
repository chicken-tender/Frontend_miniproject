import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Header from "../components/Header";
import TitleInput from "../components/Board/TitleField";
import TagField from "../components/Board/TagField";
import styled from 'styled-components';
import Button from '@mui/material/Button';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import boardAxiosApi from "../api/BoardAxiosApi";
import SelectCategory from "../components/Board/Category";
import ImageUpload from "../components/Board/ImageUpload";


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 20px;
`;

const EditorWrapper = styled.div`
  width: 65%;
  margin: 0 auto;
  
  .ck.ck-editor__editable:not(.ck-editor__nested-editable) {
    min-height: 400px;
  }
  @media (max-width: 440px) {
    width: 270px;
  }
`;



const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  padding-right: 330px;
  padding-bottom: 50px;

  @media (max-width: 400px) {
    justify-content: flex-start;
    padding-left : 60px;
  } 
`;

const ImageWrapper = styled.div`
  display: flex;
   align-items: center;
  justify-content:flex-start; 
  margin-top : 30px;
  padding-left : 260px;

  img {
    max-width: 240px;
    border-radius: 10px;
  }
  @media (max-width: 768px) {
    margin-left : 60px;
    img {
    max-width: 140px;
    }
  }
`;



const EditPage = () => {
  const { postNum } = useParams();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [boardNum, setBoardNum] = useState("");
  const [tag, setTag] = useState("");
  const [imgUrl, setImgUrl] = useState([]);
  const navigate = useNavigate();
  const [previewImgUrl, setPreviewImgUrl] = useState([]);
  
  const options = [
    { boardNum: 1, text: 'QnA' },
    { boardNum: 2, text: 'Information' },
    { boardNum: 3, text: 'Worker' },
    { boardNum: 4, text: 'Portfolio' },
  ];
  
  useEffect(() => {
    const getBoardNumByName = (boardName) => {
      const option = options.find((option) => option.text === boardName);
      return option ? option.boardNum : '';
    };
    
    const fetchPost = async () => {
      const response = await boardAxiosApi.requestPostDetail(postNum);
      const postData = response[0];
      console.log(postData);
      setBoardNum(getBoardNumByName(postData.boardName)); 
      setTitle(postData.title);
      setTag(postData.tag);
      setContent(response[0].content);
      setImgUrl(postData.imgUrl ? postData.imgUrl.split(",") : []);
      setPreviewImgUrl(postData.imgUrl ? postData.imgUrl.split(",") : []);
      
    };

    fetchPost();
  }, [postNum]);

  useEffect(() => {
    console.log("after", imgUrl);
  }, [imgUrl]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  
  const handleCategoryChange = (selectedBoardNum) => {
    setBoardNum(selectedBoardNum);
  };  
  
  
  const handleTagChange = (e) => {
    setTag(e.target.value);
  };


  const handleImageUpload = (urls) => {
    const imgUrlArray = urls.split(","); // 문자열을 쉼표로 분리하여 배열로 변환
    setImgUrl(imgUrlArray);
    setPreviewImgUrl(imgUrlArray);
  };
  
  const handleImageDelete = (index) => {
    const updatedPreview = [...previewImgUrl];
    updatedPreview.splice(index, 1); // 해당 인덱스의 이미지 1개씩 제거
    setPreviewImgUrl(updatedPreview);
    setImgUrl(updatedPreview);
  };
  
  
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setContent(data);
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!boardNum) {
      alert("게시판 카테고리를 선택해주세요.");
      return;
    }
    if (!title) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content) {
      alert("내용을 입력해주세요.");
      return;
    }
    
    const updatedPost = { postNum, boardNum, title, content, tag, imgUrl: imgUrl.length > 0 ? imgUrl.join(",") : null };
    await boardAxiosApi.updatePost(updatedPost);
    navigate(`/post/${postNum}`);
  };
  
  return (
    <>
      <Header />
      <form onSubmit={handleSubmit}>
      <Wrapper>
      <Row>
        <Col>
        <SelectCategory value={boardNum} onChange={handleCategoryChange} /> 
        <TitleInput value={title} onChange={handleTitleChange} />
        <EditorWrapper>
          <CKEditor editor={ClassicEditor} data={content} onChange={handleEditorChange}/>
        </EditorWrapper>
        {imgUrl && imgUrl.length > 0 && (
         <ImageWrapper>
        {imgUrl.map((url, index) => (
          <div key={index}>
            <img src={url} alt={`Uploaded ${index}`} />
              <Button onClick={() => handleImageDelete(index)}>삭제</Button>
          </div>
        ))}
        </ImageWrapper>
      )}
        <ImageUpload onImageUpload={handleImageUpload} defaultUrl={previewImgUrl || []} />
        <TagField value={tag} onChange={handleTagChange}/>
        </Col>
      </Row>
      </Wrapper>
      <ButtonWrapper>
      <Button variant="contained" sx={{ borderRadius: "20px", fontSize: "18px", padding: "8px 25px",
      "@media (max-width: 400px)": { fontSize: "15px",padding: "10px"}}} onClick={handleSubmit}>등록</Button>
    </ButtonWrapper>
    </form>
    </>
  );
};

export default EditPage;
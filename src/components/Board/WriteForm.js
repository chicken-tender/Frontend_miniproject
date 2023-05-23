import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import SelectCategory from './Category';
import styled from 'styled-components';
import TagField from './TagField';
import Button from '@mui/material/Button';
import ImageUpload from './ImageUpload';
import boardAxiosApi from '../../api/BoardAxiosApi';
import ContentField from './ContentField';
import TitleField from './TitleField';


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 20px;
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


const WriteForm = ({ userNum}) => {
  const [post, setPost] = useState({
    title: '',
    content: '',
    tag: '',
    imgUrl: '',
    boardNum: '',
    memberNum: userNum // 회원 번호
  });
  const [previewImgUrl, setPreviewImgUrl] = useState("");
  const navigate = useNavigate();

  const handleBoardNumChange = (boardNum) => {
    setPost((prevPost) => ({ ...prevPost, boardNum }));
  };

  const handleTitleChange = (event) => {
    const title = event.target.value;
    setPost((prevPost) => ({ ...prevPost, title }));
  };

  const handleContentChange = (content) => {
    setPost((prevPost) => ({ ...prevPost, content }));
  };

  const handleTagChange = (event) => {
    const tag = event.target.value;
    setPost((prevPost) => ({ ...prevPost, tag }));
  };

  const handleImageUpload = (urls) => {
    const imgUrl = urls;
    setPost((prevPost) => ({ ...prevPost, imgUrl }));
    setPreviewImgUrl(urls.split(",")); 
  };
  
  // 이미지 삭제 버튼 클릭시 호출
  const handleImageDelete = (index) => {
    const updatedPreview = [...previewImgUrl]; 
    updatedPreview.splice(index, 1); // 해당 인덱스의 이미지 1개씩 제거
    setPreviewImgUrl(updatedPreview);
    setPost((prevPost) => ({
      ...prevPost,
      imgUrl: updatedPreview.join(","),
    }));
  };

  const handleWritePost = async (post) => {
    try {
      const postNum = await boardAxiosApi.writePost(post);
      if (postNum > 0) {
        navigate(`/post/${postNum}`);
      }
    } catch (error) {
      console.error('게시글 작성에 실패했습니다.', error);
    }
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
      if (!post.boardNum) {
        alert("게시판 카테고리를 선택해주세요.");
        return;
      }
      if (!post.title) {
        alert("제목을 입력해주세요.");
        return;
      }
      if (!post.content) {
        alert("내용을 입력해주세요.");
        return;
      }
      handleWritePost(post);
    };
  

  return (
    <>
      <Wrapper>
        <Row>
          <Col>
            <SelectCategory value={post.boardNum} onChange={handleBoardNumChange} />
            <TitleField value={post.title} onChange={handleTitleChange} />
            <ContentField value={post.content} onChange={handleContentChange} />
            {previewImgUrl.length > 0 && (
              <ImageWrapper>
               {previewImgUrl.map((url, index) => ( 
                <div key={index}>
                 <img src={url} alt={`Uploaded ${index}`} />
                 <Button onClick={() => handleImageDelete(index)}>삭제</Button>
                 </div>))}
              </ImageWrapper>)}
            <ImageUpload onImageUpload={handleImageUpload} />
            <TagField value={post.tag} onChange={handleTagChange} />
          </Col>
        </Row>
      </Wrapper>
      <ButtonWrapper>
      <Button variant="contained" sx={{ borderRadius: "20px", fontSize: "18px", padding: "8px 25px",
      "@media (max-width: 400px)": { fontSize: "15px",padding: "10px"}}} onClick={handleSubmit}>등록</Button>
      </ButtonWrapper>
    </>
  );
};

export default WriteForm;

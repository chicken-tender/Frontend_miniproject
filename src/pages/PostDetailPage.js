import React, { useState, useEffect, useContext, useCallback } from "react";
import { UserContext } from "../context/UserInfo";
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import styled from 'styled-components';
import TagList from '../components/Board/TagList';
import PostInfo from '../components/Board/PostInfo';
import Content from '../components/Board/PostContent';
import LikeButton from '../components/Board/LikeButton';
import EditButton from '../components/Board/EditButton';
import Footer from '../components/Footer';
import boardAxiosApi from "../api/BoardAxiosApi";
import ReplyList from "../components/Board/ReplyList";


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

`;

const BoardWrapper = styled.div`
  width: 70%;
  padding: 60px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;

  @media (max-width: 400px) {
    width: 95%;
    padding: 0px;
    margin-top: 30px;
  }
`;

const TagListWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  padding-left: 8px;
  position: relative;

  @media (max-width: 400px) {
    margin: 0, auto;
    padding: 0px;
  }
`;

const CommentWrapper = styled.div`
  width: 67%;
  margin: 20px 0;
  padding : 20px 0;
  border-top : solid 1px #ccc;
  border-bottom : solid 1px #ccc;
  @media (max-width: 400px) {
    width: 90%;
  }
`;

const PostDetailPage = () => {
  const { postNum } = useParams();
  const [postDetail, setPostDetail] = useState({});
  const [reply, setReply] = useState([]);
  const [showEditButton, setShowEditButton] = useState(false);
  const { userNickname } = useContext(UserContext);

  const fetchReply = useCallback(async () => {
    const response = await boardAxiosApi.requestReply(postNum);
    setReply(response);
  }, [postNum]);
  
  useEffect(() => {
    const fetchPostDetail = async () => {
      const response = await boardAxiosApi.requestPostDetail(postNum);
      setPostDetail(response[0]);
      setShowEditButton(response[0].nickname === userNickname);
    };
    const increaseViews = async () => {
      await boardAxiosApi.increaseViews(postNum); // 조회수 증가
    };

    fetchPostDetail();
    fetchReply();
    increaseViews();
  }, [postNum, fetchReply, userNickname]);


  return (
    <>
      <Header />
        <Wrapper>
        <BoardWrapper>
          <PostInfo postDetail={postDetail} />
          <Content content={postDetail && postDetail.content} imgUrl={postDetail && postDetail.imgUrl} />
          <TagListWrapper>
          <TagList tags={postDetail && postDetail.tag} />
          <LikeButton postNum={postNum} />
          </TagListWrapper>
        </BoardWrapper>
        <CommentWrapper>
        <ReplyList postNum={postNum} reply={reply} fetchReply={fetchReply} />
        </CommentWrapper>
      </Wrapper>
        {showEditButton && <EditButton postNum={postNum} />}
      <Footer />
    </>
  );
};



export default PostDetailPage;
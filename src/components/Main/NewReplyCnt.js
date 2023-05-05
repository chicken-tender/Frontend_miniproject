import React, { useState, useEffect } from "react";
import styled from "styled-components";
import MainAxiosApi from "../../api/MainAxiosApi";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 140px;
  text-align: center;
  font-size: 1.5em;
  margin: 20px 0;
`;

const Content = styled.div`
  font-weight: lighter;
`;

const CountValue = styled.div`
  font-weight: bolder;
`;

const NewReplyCnt = () => {
  const [replyCount, setReplyCount] = useState(0);

  useEffect(() => {
    const getTodayReplyCount = async () => {
      try {
        const response = await MainAxiosApi.todayReplyCount();
        setReplyCount(response.data);
      } catch (error) {
        console.error("오늘 올라온 댓글 갯수 불러오기 오류!😱", error);
      }
    };
    getTodayReplyCount();
  }, []);

  return (
    <Container>
      <Content>새 댓글</Content>
      <CountValue>{replyCount}</CountValue>
    </Container>
  );
}

export default NewReplyCnt;
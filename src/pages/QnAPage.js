import React from "react";
import BoardList from "../components/Board/BoardList";
import styled from "styled-components";
import Header from "../components/Header";
const BoardName = styled.div`
  font-size: 1.8rem;
  margin: 30px 0px 10px 120px;
  padding : 10px 0px 0px 100px;
  width: 100%;
  
`;
const QnAPage = () => {
  return (
  <>
    <Header />
    <BoardName>
      Q&A
    </BoardName>
    <BoardList />
  </>
  );
};
export default QnAPage;
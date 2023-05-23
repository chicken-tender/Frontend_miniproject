import { useEffect, useState } from 'react';
import boardAxiosApi from '../api/BoardAxiosApi';
import BoardList from "../components/Board/BoardList";
import styled from "styled-components";
import Header from "../components/Header";
import SearchInput from "../components/Board/SearchField";
import Pages from "../components/Board/Paginations";
import Footer from "../components/Footer";
import BoardWriteButton from '../components/Board/BoardWriteButton';
import { useParams } from "react-router-dom";

const BoardName = styled.div`
  text-align: center;
  font-size: 2.2rem;
  font-weight: bold;
  padding : 90px 0px 10px 0px;
  
  @media (max-width: 768px) {
    text-align: center;
    margin: 30px 0 10px 0;
    padding: 10px 0;
    font-size: 1.6rem;
  }
`;

const WriteButtonWrapper = styled.div`
  text-align: right;
  padding-top : 30px;
  margin-right: 190px;

  @media (max-width: 400px) {
    margin-right : 40px;
  }
`;


const BoardPage = ({boardName, boardNum}) => {
  const { pageNum } = useParams();
  const [resultData, setResultData] = useState(null);
  const [keyword, setKeyword] = useState("");
  
  const handleSetResultData = (data) => {
    setResultData(data);
  };
  const handleSetKeyword = (newKeyword) => {
    setKeyword(newKeyword);
  }

  const getBoardName = (boardName) => {
    switch (boardName) {
      case "Information":
        return "정보 공유";
      case "QnA":
        return "Q&A";
      case "Worker":
        return "직장인";
        case "Best":
        return "BEST";
      default:
        return boardName;
    }
  };
  
  // 정보공유에서 추천수 100개인 글 베스트 게시판으로 이동
  useEffect(() => {
    if (boardName === "Best") {
      boardAxiosApi.moveBestBoard();
    }
  }, [boardName]);
  
  
  return (
    <>
      <Header />
      <BoardName>{getBoardName(boardName)}</BoardName>
      <SearchInput boardName={boardName.toLowerCase()} pageNum={pageNum} setResultData={handleSetResultData} setKeyword={handleSetKeyword} />
      <BoardList boardName={boardName.toLowerCase()} pageNum={pageNum} resultData={resultData} />
      <WriteButtonWrapper>
        <BoardWriteButton />
      </WriteButtonWrapper>
      {resultData && <Pages boardNum={boardNum} path={`/${boardName.toLowerCase()}`} keyword={keyword} resultData={resultData} />}
      {!resultData && <Pages boardNum={boardNum} path={`/${boardName.toLowerCase()}`} />}
      <Footer />
    </>
  );
};

export default BoardPage;
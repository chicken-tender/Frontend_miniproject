import React, { useContext, useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from "react-router-dom";
import MatchingAxiosApi from '../../api/MatchingAxiosApi';
import { UserContext } from '../../context/UserInfo';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 100px;
  margin: 190px 0;
  @media screen and (max-width: 768px) {
    gap: 40px;
    margin: 160px 3px;
  }
`;

const ItemContent = styled.div`
  text-align: center;
`;

const ItemTitle = styled.h1`
  font-size: 3rem;
  line-height: 80px;
  font-weight: bold;
  @media screen and (max-width: 768px) {
    font-size: 1.2em;
    line-height: 40px;
  }
`;

const Button = styled.a`
  display: block;
  position: relative;
  float: left;
  width: 300px;
  height: 100px;
  padding: 0;
  margin: 10px 20px 10px 0;
  font-weight: 600;
  text-align: center;
  line-height: 100px;
  color: #FFF;
  border-radius: 10px;
  transition: all 0.2s;
  background: #3B74EC;
  box-shadow: 0px 8px 0px 0px #002081;
  text-decoration: none;
  font-size: 2em;
  &:hover {
    margin-top: 15px;
    margin-bottom: 5px;
    box-shadow: 0px 0px 0px 0px #3B74EC;
  }
  @media screen and (max-width: 768px) {
    width: 150px;
    height: 50px;
    line-height: 50px;
    font-size: 1.5em;
  }
`;

const Start = () => {
  const [userMemberNum, setUserMemberNum] = useState(0);
  // 🔴 로그인 정보 가져오기
  const { userEmail } = useContext(UserContext);
  const navigate = useNavigate();
  // 🔴 로그인 유저 회원번호 가져오기
  useEffect(() => {
    const getMenteeMemberNum = async () => {
      try {
        const response = await MatchingAxiosApi.menteeMemberNum(userEmail);
        setUserMemberNum(response.data);
      } catch (error) {
        navigate('resultFail');
        console.log("멘티 회원정보 가져오기 오류 🥹", error);
      }
    };
    getMenteeMemberNum();
  }, [userEmail, navigate]);

  // 🚀 1. UserContext에서 필요한 요소 가져오기
  const { setMentorNickname, setMentorPfImg, setMenteeNickname, setMenteePfImg, setMenteeNum, setMentorNum } = useContext(UserContext);

  const StartButtonClick = async () => {
    navigate('loading');
    setTimeout(async () => {
      try {
        const menteeMemberNum = userMemberNum;
        const response = await MatchingAxiosApi.mentorInfo(menteeMemberNum);
        const response2 = await MatchingAxiosApi.menteeInfo(userEmail);
  
        // 🚀 2. 서버에서 가져온 정보 UserContext, ChatContext에 저장
        setMentorNickname(response.data[0].nickname);
        setMentorPfImg(response.data[0].pfImg);
        setMentorNum(response.data[0].memberNum);

        setMenteeNickname(response2.data[0].nickname);
        setMenteePfImg(response2.data[0].pfImg);
        setMenteeNum(response2.data[0].memberNum);
  
        navigate('result');
      } catch(error) {
        navigate('resultFail');
        console.error("멘토 정보 불러오기 실패. . 🥹", error);
        // navigate('result');
      }
    }, 3000);
  };

  return (
    <>
      <GlobalStyle />
      <StyledContainer>
        <ItemContent>
          <ItemTitle>성장하는 개발자가 되기 위한 한 걸음 🚀</ItemTitle>
          <ItemTitle>지금 멘토가 당신과의 만남을 기다리고 있습니다.</ItemTitle>
        </ItemContent>
        <Button onClick={StartButtonClick}>매칭하기</Button>
      </StyledContainer>
    </>
  );
};

export default Start;